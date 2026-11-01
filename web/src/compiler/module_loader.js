import { languageError } from './errors.js';
import { tokenize } from './lexer.js';
import { Parser } from './parser.js';
import { isBuiltinModule } from './stdlib.js';

const MODULE_EXTENSION = '.chip';
const MAX_FILENAME_BYTES = 17;

export function parseProgramWithModules(source, { resolveModule, sourceName } = {}) {
    const rootUnit = createUnit(source, null, sourceName);
    const modules = new Map();
    loadImports(rootUnit, [], modules, resolveModule);

    const units = [rootUnit, ...modules.values()];
    const functions = [];
    const dataDeclarations = [];
    for (const unit of units) {
        for (const fn of unit.program.functions) {
            fn.moduleName = unit.moduleName;
            fn.symbolName = unit.moduleName ? `${unit.moduleName}.${fn.name}` : fn.name;
            fn.imports = unit.imports;
            functions.push(fn);
        }
        for (const declaration of unit.program.dataDeclarations) {
            declaration.moduleName = unit.moduleName;
            dataDeclarations.push(declaration);
        }
    }

    return { kind: 'Program', functions, dataDeclarations, modules, rootUnit };
}

function createUnit(source, moduleName, fileName) {
    const program = new Parser(tokenize(source, fileName)).parseProgram();
    return {
        moduleName,
        fileName,
        program,
        imports: new Map()
    };
}

function loadImports(unit, activeModules, modules, resolveModule) {
    for (const declaration of unit.program.imports) {
        let imported = unit.imports.get(declaration.moduleName);
        if (!imported) {
            imported = {
                all: false,
                names: new Set(),
                span: declaration.span
            };
            unit.imports.set(declaration.moduleName, imported);
        }
        if (declaration.name === null) {
            imported.all = true;
            imported.names.clear();
        } else if (!imported.all) {
            imported.names.add(declaration.name);
        }
    }

    for (const [moduleName, imported] of unit.imports) {
        if (activeModules.includes(moduleName)) {
            const cycle = [...activeModules.slice(activeModules.indexOf(moduleName)), moduleName];
            throw languageError('LANG012', `Cyclic module import: ${cycle.join(' -> ')}.`, imported.span);
        }
        if (isBuiltinModule(moduleName)) continue;

        let moduleUnit = modules.get(moduleName);
        if (!moduleUnit) {
            const filename = `${moduleName}${MODULE_EXTENSION}`;
            if (new TextEncoder().encode(filename).length > MAX_FILENAME_BYTES) {
                throw languageError('LANG014',
                    `Module name "${moduleName}" is too long for a virtual-disk filename.`,
                    imported.span);
            }
            if (typeof resolveModule !== 'function') {
                throw languageError('LANG011',
                    `Module "${moduleName}" requires a virtual-disk module resolver.`,
                    imported.span);
            }

            const bytes = resolveModule(filename);
            if (bytes === null || bytes === undefined) {
                throw languageError('LANG011', `Module source "${filename}" was not found.`, imported.span);
            }
            const moduleSource = decodeModuleSource(bytes, filename, imported.span);
            moduleUnit = createUnit(moduleSource, moduleName, filename);
            modules.set(moduleName, moduleUnit);
            loadImports(moduleUnit, [...activeModules, moduleName], modules, resolveModule);
        }
    }
}

function decodeModuleSource(bytes, filename, span) {
    if (typeof bytes === 'string') return bytes;
    if (!(bytes instanceof Uint8Array)) {
        throw new TypeError(`The module resolver must return Uint8Array, string, or null for ${filename}.`);
    }
    try {
        return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    } catch {
        throw languageError('LANG013', `Module source "${filename}" is not valid UTF-8.`, span);
    }
}

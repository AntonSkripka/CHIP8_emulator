import { asmToBin } from '../assembler/asm.js';
import { languageError } from './errors.js';
import { parseProgramWithModules } from './module_loader.js';
import { analyzeProgram } from './semantic.js';

const BASE_ADDRESS = 0x200;
const MEMORY_END = 0x1000;
const EXTENDED_INSTRUCTIONS = new Set(['ENTER', 'LEAVE', 'ADJSP', 'DROP', 'LDX', 'STX', 'LDI', 'TRAP', 'SYS']);

export function compile(source, options = {}) {
    const program = parseProgramWithModules(source, options);
    const { main } = analyzeProgram(program);
    const emitter = new CodeEmitter();
    const functionLabels = new Map(
        program.functions.map((fn, index) => {
            fn.label = `__FN_${index}`;
            return [fn.symbolName, fn.label];
        })
    );
    for (const [index, declaration] of program.dataDeclarations.entries()) {
        declaration.label = `__DATA_${index}`;
    }
    const mainLabel = functionLabels.get(main.symbolName);
    const bssDeclarations = program.dataDeclarations.filter(({ section }) => section === 'bss');
    const usesVfs = program.functions.some((fn) =>
        fn.callSites.some((call) => call.function.kind === 'BuiltinFunction'));
    const bssSize = bssDeclarations.reduce((total, declaration) => total + declaration.size, 0) +
        (usesVfs ? 11 : 0);

    emitter.instruction('JP __START', syntheticSpan);
    for (const fn of program.functions) {
        emitter.label(fn.label);
        emitter.instruction('ENTER', fn.span);
        emitter.instruction(`ADJSP ${fn.localCount}`, fn.span);
        emitBlock(fn.body, fn, emitter, functionLabels);
        if (fn.returnType === 'void') emitReturn(fn, emitter);
    }

    emitter.label('__START');
    if (bssSize > 0) emitBssInitialization(bssSize, emitter);
    emitter.instruction(`JP ${mainLabel}`, syntheticSpan);
    emitter.label('__EXIT');
    emitter.instruction('JP __EXIT', syntheticSpan);

    for (const section of ['data', 'rodata']) {
        for (const declaration of program.dataDeclarations.filter((entry) => entry.section === section)) {
            emitter.data(declaration.label, declaration.values, declaration);
        }
    }
    if (bssSize > 0) {
        emitter.label('__BSS_START');
        for (const declaration of bssDeclarations) {
            emitter.reserve(declaration.label, declaration.size, declaration);
        }
        if (usesVfs) {
            emitter.reserve('__VFS_REQUEST', 11, {
                name: 'compiler VFS request block',
                span: syntheticSpan
            });
        }
    }

    const layout = emitter.resolveLayout();
    const assembly = emitter.toAssembly(layout.symbols);
    const segments = asmToBin(assembly);
    const imageEnd = segments.reduce((end, segment) =>
        Math.max(end, segment.start + segment.bytes.reduce((sum, item) => sum + item.size, 0)), BASE_ADDRESS);
    const rom = new Uint8Array(imageEnd - BASE_ADDRESS);

    for (const segment of segments) {
        let address = segment.start;
        for (const item of segment.bytes) {
            if (item.size === 1) {
                rom[address - BASE_ADDRESS] = item.val;
            } else {
                rom[address - BASE_ADDRESS] = item.val >> 8;
                rom[address - BASE_ADDRESS + 1] = item.val & 0xFF;
            }
            address += item.size;
        }
    }

    const symbols = {};
    for (const fn of program.functions) symbols[fn.symbolName] = layout.symbols.get(fn.label);
    for (const declaration of program.dataDeclarations) {
        const name = declaration.moduleName
            ? `${declaration.moduleName}.${declaration.name}`
            : declaration.name;
        symbols[name] = layout.symbols.get(declaration.label);
    }
    symbols.__entry = BASE_ADDRESS;
    symbols.__start = layout.symbols.get('__START');
    symbols.__exit = layout.symbols.get('__EXIT');
    if (bssSize > 0) symbols.__bss_start = layout.symbols.get('__BSS_START');

    return {
        profile: 'chip8-dev',
        baseAddress: BASE_ADDRESS,
        rom,
        segments,
        symbols,
        bss: { start: layout.bssStart, size: bssSize },
        sections: layout.sections,
        sourceMap: layout.sourceMap,
        assembly
    };
}

const syntheticSpan = { line: 0, column: 0, synthetic: true };

class CodeEmitter {
    constructor() {
        this.records = [];
        this.labelCounter = 0;
    }

    instruction(text, span) {
        this.records.push({ kind: 'instruction', text, span });
    }

    data(label, values, declaration) {
        this.records.push({ kind: 'data', label, values, section: declaration.section, span: declaration });
    }

    addressByte(label, part, span) {
        this.records.push({ kind: 'address-byte', label, part, span });
    }

    reserve(label, size, declaration) {
        this.records.push({ kind: 'bss', label, size, span: declaration });
    }

    label(name) {
        this.records.push({ kind: 'label', text: `${name}:` });
    }

    newLabel() {
        return `__L_${this.labelCounter++}`;
    }

    resolveLayout() {
        let address = BASE_ADDRESS;
        const symbols = new Map();
        const sourceMap = [];
        let bssStart = null;
        let textEnd = null;
        const sectionRanges = {
            data: { start: null, end: null },
            rodata: { start: null, end: null },
            bss: { start: null, end: null }
        };

        for (const record of this.records) {
            if (record.kind === 'label') {
                symbols.set(record.text.slice(0, -1), address);
                continue;
            }

            if (record.kind === 'bss') {
                textEnd ??= address;
                record.address = address;
                symbols.set(record.label, address);
                bssStart ??= address;
                sectionRanges.bss.start ??= address;
                if (address + record.size > MEMORY_END) {
                    throw languageError('LANG010',
                        `BSS object "${record.span.name}" exceeds CHIP-8 memory.`, record.span);
                }
                address += record.size;
                sectionRanges.bss.end = address;
                continue;
            }

            if (record.kind === 'data') {
                textEnd ??= address;
                record.address = address;
                symbols.set(record.label, address);
                if (address + record.values.length > MEMORY_END) {
                    throw languageError('LANG010',
                        `Data object "${record.span.name}" exceeds CHIP-8 memory.`, record.span);
                }
                sourceMap.push({
                    address,
                    endAddress: address + record.values.length,
                    line: record.span.span.line,
                    column: record.span.span.column,
                    synthetic: false,
                    ...(record.span.span.fileName ? { fileName: record.span.span.fileName } : {})
                });
                address += record.values.length;
                sectionRanges[record.section].start ??= record.address;
                sectionRanges[record.section].end = address;
                continue;
            }

            const instruction = record.kind === 'address-byte'
                ? null
                : record.text.split(/\s/, 1)[0].toUpperCase();
            const size = record.kind === 'address-byte'
                ? 2
                : EXTENDED_INSTRUCTIONS.has(instruction) ? 4 : 2;
            if (address + size > MEMORY_END) {
                throw languageError('LANG010', 'Compiled code exceeds CHIP-8 memory.', record.span);
            }
            if (record.span) {
                const sourceSpan = record.span.span ?? record.span;
                sourceMap.push({
                    address,
                    endAddress: address + size,
                    line: sourceSpan.line,
                    column: sourceSpan.column,
                    synthetic: sourceSpan.synthetic === true,
                    ...(sourceSpan.fileName ? { fileName: sourceSpan.fileName } : {})
                });
            }
            address += size;
        }
        textEnd ??= address;
        return {
            symbols,
            sourceMap,
            bssStart,
            sections: {
                text: { start: BASE_ADDRESS, size: textEnd - BASE_ADDRESS },
                data: makeSectionRange(sectionRanges.data),
                rodata: makeSectionRange(sectionRanges.rodata),
                bss: makeSectionRange(sectionRanges.bss)
            }
        };
    }

    toAssembly(symbols) {
        return this.records.flatMap((record) => {
            if (record.kind === 'data') {
                return [`${record.label}: DB ${record.values.map(({ value }) => value).join(', ')}`];
            }
            if (record.kind === 'address-byte') {
                const address = symbols.get(record.label);
                const value = record.part === 'high' ? address >> 8 : address & 0xFF;
                return [`LD V0, ${value}`];
            }
            if (record.kind === 'bss') {
                return [`ORG ${record.address}`, `${record.label}:`];
            }
            return [record.text];
        }).join('\n');
    }
}

function makeSectionRange(range) {
    return {
        start: range.start,
        size: range.start === null ? 0 : range.end - range.start
    };
}

function emitBssInitialization(size, emitter) {
    emitter.instruction('LD I, __BSS_START', syntheticSpan);
    emitter.instruction('LD V0, 0', syntheticSpan);

    let remaining = size;
    while (remaining > 0) {
        const chunkSize = Math.min(remaining, 0xFF);
        const loopLabel = emitter.newLabel();
        emitter.instruction(`LD V1, ${chunkSize}`, syntheticSpan);
        emitter.label(loopLabel);
        emitter.instruction('LD [I], V0', syntheticSpan);
        emitter.instruction('ADD V1, 0xFF', syntheticSpan);
        emitter.instruction('SE V1, 0', syntheticSpan);
        emitter.instruction(`JP ${loopLabel}`, syntheticSpan);
        remaining -= chunkSize;
    }
}

function emitBlock(block, fn, emitter, functionLabels) {
    for (const statement of block.statements) {
        emitStatement(statement, fn, emitter, functionLabels);
    }
}

function emitStatement(statement, fn, emitter, functionLabels) {
    switch (statement.kind) {
        case 'Block':
            emitBlock(statement, fn, emitter, functionLabels);
            return;
        case 'VariableDeclaration':
            emitExpression(statement.initializer, fn, emitter, functionLabels);
            emitter.instruction(`STX ${statement.offset}`, statement);
            return;
        case 'ExpressionStatement':
            emitExpression(statement.expression, fn, emitter, functionLabels);
            return;
        case 'EmptyStatement':
            emitter.instruction('ADD V0, 0', statement);
            return;
        case 'ReturnStatement':
            if (statement.value) emitExpression(statement.value, fn, emitter, functionLabels);
            emitReturn(fn, emitter);
            return;
        case 'IfStatement': {
            const alternateLabel = emitter.newLabel();
            const endLabel = statement.alternate ? emitter.newLabel() : alternateLabel;
            emitExpression(statement.condition, fn, emitter, functionLabels);
            emitter.instruction('SNE V0, 0', statement.condition);
            emitter.instruction(`JP ${alternateLabel}`, statement.condition);
            emitBlock(statement.consequent, fn, emitter, functionLabels);
            if (statement.alternate) {
                emitter.instruction(`JP ${endLabel}`, statement);
                emitter.label(alternateLabel);
                emitBlock(statement.alternate, fn, emitter, functionLabels);
            }
            emitter.label(endLabel);
            return;
        }
        case 'WhileStatement': {
            const conditionLabel = emitter.newLabel();
            const endLabel = emitter.newLabel();
            emitter.label(conditionLabel);
            emitExpression(statement.condition, fn, emitter, functionLabels);
            emitter.instruction('SNE V0, 0', statement.condition);
            emitter.instruction(`JP ${endLabel}`, statement.condition);
            emitBlock(statement.body, fn, emitter, functionLabels);
            emitter.instruction(`JP ${conditionLabel}`, statement);
            emitter.label(endLabel);
            return;
        }
        default:
            throw languageError('LANG009', `Cannot generate statement "${statement.kind}".`, statement);
    }
}

function emitReturn(fn, emitter) {
    if (fn.name === 'main') {
        emitter.instruction('LEAVE', fn);
        emitter.instruction('JP __EXIT', fn);
    } else {
        emitter.instruction('LEAVE', fn);
        emitter.instruction('RET', fn);
    }
}

function emitExpression(expression, fn, emitter, functionLabels) {
    switch (expression.kind) {
        case 'NumberLiteral':
        case 'CharacterLiteral':
            emitter.instruction(`LD V0, ${expression.value}`, expression);
            return;
        case 'BooleanLiteral':
            emitter.instruction(`LD V0, ${expression.value ? 1 : 0}`, expression);
            return;
        case 'Identifier':
            emitter.instruction(`LDX ${expression.binding.offset}`, expression);
            return;
        case 'IndexExpression':
            emitExpression(expression.index, fn, emitter, functionLabels);
            emitArrayBoundsCheck(expression.index, expression.binding, emitter);
            emitArrayBase(expression.binding, expression, emitter);
            emitter.instruction('ADD I, V0', expression);
            emitter.instruction('LD V0, [I]', expression);
            return;
        case 'Assignment':
            if (expression.left.kind === 'IndexExpression') {
                emitArrayAssignment(expression, fn, emitter, functionLabels);
            } else {
                emitExpression(expression.right, fn, emitter, functionLabels);
                emitter.instruction(`STX ${expression.left.binding.offset}`, expression);
            }
            return;
        case 'CallExpression':
            if (expression.function.kind === 'BuiltinFunction') {
                emitVfsCall(expression, emitter);
                return;
            }
            for (let index = 0; index < expression.arguments.length; index++) {
                const argument = expression.arguments[index];
                const parameter = expression.function.parameters[index];
                if (parameter.isArray) {
                    emitArrayReferenceArgument(argument.arrayBinding, argument, emitter);
                } else {
                    emitExpression(argument, fn, emitter, functionLabels);
                    emitter.instruction('PUSH V0', argument);
                }
            }
            emitter.instruction(`CALL ${functionLabels.get(expression.function.symbolName)}`, expression);
            for (const parameter of expression.function.parameters) {
                for (let byte = 0; byte < parameter.width; byte++) {
                    emitter.instruction('POP V1', expression);
                }
            }
            return;
        case 'UnaryExpression':
            emitExpression(expression.operand, fn, emitter, functionLabels);
            if (expression.operator === '!') {
                emitter.instruction('LD V1, V0', expression);
                emitter.instruction('LD V0, 1', expression);
                emitter.instruction('SE V1, 0', expression);
                emitter.instruction('LD V0, 0', expression);
            } else {
                emitter.instruction('LD V1, 0', expression);
                emitter.instruction('SUB V1, V0', expression);
                emitter.instruction('LD V0, V1', expression);
            }
            return;
        case 'BinaryExpression':
            emitBinaryExpression(expression, fn, emitter, functionLabels);
            return;
        default:
            throw languageError('LANG009', `Cannot generate expression "${expression.kind}".`, expression);
    }
}

function emitArrayAssignment(expression, fn, emitter, functionLabels) {
    const target = expression.left;
    emitExpression(target.index, fn, emitter, functionLabels);
    emitter.instruction('PUSH V0', target.index);
    emitExpression(expression.right, fn, emitter, functionLabels);
    emitter.instruction('PUSH V0', expression.right);
    emitter.instruction('POP V2', expression);
    emitter.instruction('POP V0', expression);
    emitArrayBoundsCheck(target.index, target.binding, emitter);
    emitArrayBase(target.binding, expression, emitter);
    emitter.instruction('ADD I, V0', expression);
    emitter.instruction('LD V0, V2', expression);
    emitter.instruction('LD [I], V0', expression);
}

function emitArrayBoundsCheck(index, target, emitter) {
    if (target.kind !== 'arrayParameter') {
        if (target.size > 0xFF || index.kind === 'NumberLiteral' ||
            index.kind === 'CharacterLiteral') return;

        emitU8BoundsCheck(index, target.size, emitter);
        return;
    }

    const lowLengthLabel = emitter.newLabel();
    const trapLabel = emitter.newLabel();
    const continueLabel = emitter.newLabel();
    emitter.instruction('PUSH V0', index);
    emitter.instruction(`LDX ${target.lengthOffset}`, index);
    emitter.instruction('SE V0, 0', index);
    emitter.instruction(`JP ${continueLabel}`, index);
    emitter.instruction(`JP ${lowLengthLabel}`, index);
    emitter.label(lowLengthLabel);
    emitter.instruction(`LDX ${target.lengthOffset + 1}`, index);
    emitter.instruction('LD V1, V0', index);
    emitter.instruction('PEAK V0', index);
    emitter.instruction('SUB V1, V0', index);
    emitter.instruction('SNE VF, 0', index);
    emitter.instruction(`JP ${trapLabel}`, index);
    emitter.instruction(`JP ${continueLabel}`, index);
    emitter.label(trapLabel);
    emitter.instruction('TRAP 9', index);
    emitter.label(continueLabel);
    emitter.instruction('POP V0', index);
}

function emitU8BoundsCheck(index, size, emitter) {
    const trapLabel = emitter.newLabel();
    const continueLabel = emitter.newLabel();
    emitter.instruction(`LD V1, ${size}`, index);
    emitter.instruction('SUB V1, V0', index);
    emitter.instruction('SNE VF, 0', index);
    emitter.instruction(`JP ${trapLabel}`, index);
    emitter.instruction(`JP ${continueLabel}`, index);
    emitter.label(trapLabel);
    emitter.instruction('TRAP 9', index);
    emitter.label(continueLabel);
}

function emitArrayBase(binding, span, emitter) {
    if (binding.kind === 'arrayParameter') {
        emitter.instruction(`LDI ${binding.offset}`, span);
    } else {
        emitter.instruction(`LD I, ${binding.label}`, span);
    }
}

function emitArrayReferenceArgument(binding, span, emitter) {
    if (binding.kind === 'arrayParameter') {
        for (let offset = 0; offset < 4; offset++) {
            emitter.instruction(`LDX ${binding.offset + offset}`, span);
            emitter.instruction('PUSH V0', span);
        }
        return;
    }

    emitter.addressByte(binding.label, 'high', span);
    emitter.instruction('PUSH V0', span);
    emitter.addressByte(binding.label, 'low', span);
    emitter.instruction('PUSH V0', span);
    emitter.instruction(`LD V0, ${(binding.size >> 8) & 0xFF}`, span);
    emitter.instruction('PUSH V0', span);
    emitter.instruction(`LD V0, ${binding.size & 0xFF}`, span);
    emitter.instruction('PUSH V0', span);
}

function emitVfsCall(expression, emitter) {
    const builtin = expression.function;
    const bindings = expression.arguments.map(({ arrayBinding }) => arrayBinding);
    const invalidLabel = emitter.newLabel();
    const endLabel = emitter.newLabel();

    for (let index = 0; index < builtin.parameters.length; index++) {
        const parameter = builtin.parameters[index];
        if (parameter.minLength !== undefined || parameter.maxLength !== undefined) {
            emitArrayLengthGuard(
                bindings[index],
                parameter,
                invalidLabel,
                emitter,
                expression
            );
        }
    }

    if (builtin.resultParameter !== undefined) {
        const outputBinding = bindings[builtin.resultParameter];
        for (let index = 0; index < bindings.length; index++) {
            if (index !== builtin.resultParameter) {
                emitRejectAliasedArray(
                    outputBinding,
                    bindings[index],
                    invalidLabel,
                    emitter,
                    expression
                );
            }
        }
    }

    emitStoreRequestArrayField(0, bindings[0], 'address-high', expression, emitter);
    emitStoreRequestArrayField(1, bindings[0], 'address-low', expression, emitter);
    emitStoreRequestArrayField(2, bindings[0], 'length-low', expression, emitter);
    if (builtin.operation === 2 || builtin.operation === 3) {
        emitStoreRequestArrayField(3, bindings[1], 'address-high', expression, emitter);
        emitStoreRequestArrayField(4, bindings[1], 'address-low', expression, emitter);
        emitStoreRequestArrayField(5, bindings[1], 'length-high', expression, emitter);
        emitStoreRequestArrayField(6, bindings[1], 'length-low', expression, emitter);
    }

    emitter.instruction('LD I, __VFS_REQUEST', expression);
    emitter.instruction(`SYS ${builtin.operation}`, expression);
    if (builtin.resultParameter !== undefined) {
        emitCopyVfsResult(
            bindings[builtin.resultParameter],
            expression,
            emitter
        );
    }
    emitter.instruction(`JP ${endLabel}`, expression);
    emitter.label(invalidLabel);
    emitter.instruction('LD V0, 2', expression);
    emitter.label(endLabel);
}

function emitArrayLengthGuard(binding, parameter, invalidLabel, emitter, span) {
    if (binding.kind !== 'arrayParameter') return;

    const validLengthLabel = emitter.newLabel();
    if (parameter.maxLength !== undefined) {
        emitter.instruction(`LDX ${binding.lengthOffset}`, span);
        emitter.instruction('SE V0, 0', span);
        emitter.instruction(`JP ${invalidLabel}`, span);
        emitter.instruction(`LDX ${binding.lengthOffset + 1}`, span);
        emitter.instruction(`LD V1, ${parameter.maxLength}`, span);
        emitter.instruction('SUB V0, V1', span);
        emitter.instruction('SE VF, 0', span);
        emitter.instruction(`JP ${invalidLabel}`, span);
        return;
    }

    emitter.instruction(`LDX ${binding.lengthOffset}`, span);
    emitter.instruction('SE V0, 0', span);
    emitter.instruction(`JP ${validLengthLabel}`, span);
    emitter.instruction(`LDX ${binding.lengthOffset + 1}`, span);
    emitter.instruction(`LD V1, ${parameter.minLength}`, span);
    emitter.instruction('SUB V1, V0', span);
    emitter.instruction('SE VF, 0', span);
    emitter.instruction(`JP ${invalidLabel}`, span);
    emitter.label(validLengthLabel);
}

function emitRejectAliasedArray(first, second, invalidLabel, emitter, span) {
    const compareLowLabel = emitter.newLabel();
    const differentLabel = emitter.newLabel();
    emitLoadArrayAddressByte(first, 'high', 'V1', span, emitter);
    emitLoadArrayAddressByte(second, 'high', 'V0', span, emitter);
    emitter.instruction('SNE V0, V1', span);
    emitter.instruction(`JP ${compareLowLabel}`, span);
    emitter.instruction(`JP ${differentLabel}`, span);
    emitter.label(compareLowLabel);
    emitLoadArrayAddressByte(first, 'low', 'V1', span, emitter);
    emitLoadArrayAddressByte(second, 'low', 'V0', span, emitter);
    emitter.instruction('SNE V0, V1', span);
    emitter.instruction(`JP ${invalidLabel}`, span);
    emitter.instruction(`JP ${differentLabel}`, span);
    emitter.label(differentLabel);
}

function emitLoadArrayAddressByte(binding, part, register, span, emitter) {
    if (binding.kind === 'arrayParameter') {
        const offset = binding.offset + (part === 'low' ? 1 : 0);
        emitter.instruction(`LDX ${offset}`, span);
        if (register !== 'V0') emitter.instruction(`LD ${register}, V0`, span);
    } else {
        emitter.addressByte(binding.label, part, span);
        if (register !== 'V0') emitter.instruction(`LD ${register}, V0`, span);
    }
}

function emitStoreRequestArrayField(offset, binding, field, span, emitter) {
    emitter.instruction('LD I, __VFS_REQUEST', span);
    if (offset > 0) {
        emitter.instruction(`LD V1, ${offset}`, span);
        emitter.instruction('ADD I, V1', span);
    }

    if (field.startsWith('address-')) {
        emitLoadArrayAddressByte(binding, field.slice(8), 'V0', span, emitter);
    } else if (binding.kind === 'arrayParameter') {
        const lengthOffset = binding.lengthOffset + (field === 'length-low' ? 1 : 0);
        emitter.instruction(`LDX ${lengthOffset}`, span);
    } else {
        const value = field === 'length-high'
            ? binding.size >> 8
            : binding.size & 0xFF;
        emitter.instruction(`LD V0, ${value}`, span);
    }
    emitter.instruction('LD [I], V0', span);
}

function emitCopyVfsResult(binding, span, emitter) {
    emitter.instruction('LD V5, V0', span);
    emitter.instruction('LD I, __VFS_REQUEST', span);
    emitter.instruction('LD V0, 7', span);
    emitter.instruction('ADD I, V0', span);
    for (let index = 1; index <= 4; index++) {
        emitter.instruction('LD V0, [I]', span);
        emitter.instruction(`LD V${index}, V0`, span);
    }

    emitArrayBase(binding, span, emitter);
    for (let index = 1; index <= 4; index++) {
        emitter.instruction(`LD V0, V${index}`, span);
        emitter.instruction('LD [I], V0', span);
    }
    emitter.instruction('LD V0, V5', span);
}

function emitBinaryExpression(expression, fn, emitter, functionLabels) {
    const { operator } = expression;
    if (operator === '&&') {
        const falseLabel = emitter.newLabel();
        const endLabel = emitter.newLabel();
        emitExpression(expression.left, fn, emitter, functionLabels);
        emitter.instruction('SNE V0, 0', expression.left);
        emitter.instruction(`JP ${falseLabel}`, expression.left);
        emitExpression(expression.right, fn, emitter, functionLabels);
        emitter.instruction(`JP ${endLabel}`, expression);
        emitter.label(falseLabel);
        emitter.instruction('LD V0, 0', expression);
        emitter.label(endLabel);
        return;
    }

    if (operator === '||') {
        const trueLabel = emitter.newLabel();
        const endLabel = emitter.newLabel();
        emitExpression(expression.left, fn, emitter, functionLabels);
        emitter.instruction('SE V0, 0', expression.left);
        emitter.instruction(`JP ${trueLabel}`, expression.left);
        emitExpression(expression.right, fn, emitter, functionLabels);
        emitter.instruction(`JP ${endLabel}`, expression);
        emitter.label(trueLabel);
        emitter.instruction('LD V0, 1', expression);
        emitter.label(endLabel);
        return;
    }

    emitExpression(expression.left, fn, emitter, functionLabels);
    emitter.instruction('PUSH V0', expression.left);
    emitExpression(expression.right, fn, emitter, functionLabels);
    emitter.instruction('POP V1', expression);

    switch (operator) {
        case '+':
            emitter.instruction('ADD V0, V1', expression);
            return;
        case '-':
            emitter.instruction('SUB V1, V0', expression);
            emitter.instruction('LD V0, V1', expression);
            return;
        case '*':
            emitter.instruction('MUL V0, V1', expression);
            return;
        case '/':
            emitter.instruction('DIV V1, V0', expression);
            emitter.instruction('LD V0, V1', expression);
            return;
        case '%':
            emitter.instruction('REM V1, V0', expression);
            emitter.instruction('LD V0, V1', expression);
            return;
        case '<':
            emitter.instruction('SUBN V1, V0', expression);
            emitter.instruction('LD V0, VF', expression);
            return;
        case '>':
            emitter.instruction('SUB V1, V0', expression);
            emitter.instruction('LD V0, VF', expression);
            return;
        case '<=':
            emitter.instruction('SUB V1, V0', expression);
            emitInverseFlag(expression, emitter);
            return;
        case '>=':
            emitter.instruction('SUBN V1, V0', expression);
            emitInverseFlag(expression, emitter);
            return;
        case '==':
        case '!=':
            emitEquality(operator, expression, emitter);
            return;
        default:
            throw languageError('LANG009', `Cannot generate operator "${operator}".`, expression);
    }
}

function emitInverseFlag(expression, emitter) {
    emitter.instruction('LD V0, 1', expression);
    emitter.instruction('SE VF, 0', expression);
    emitter.instruction('LD V0, 0', expression);
}

function emitEquality(operator, expression, emitter) {
    const endLabel = emitter.newLabel();
    emitter.instruction('LD V2, 0', expression);
    emitter.instruction(`${operator === '==' ? 'SE' : 'SNE'} V1, V0`, expression);
    emitter.instruction(`JP ${endLabel}`, expression);
    emitter.instruction('LD V2, 1', expression);
    emitter.label(endLabel);
    emitter.instruction('LD V0, V2', expression);
}

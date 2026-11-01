import { languageError } from './errors.js';
import { createBuiltinModules } from './stdlib.js';

const RESERVED_IDENTIFIERS = new Set([
    'fn', 'u8', 'bool', 'if', 'else', 'while', 'return', 'true', 'false',
    'data', 'rodata', 'bss', 'mut', 'pub', '__entry', '__start', '__exit', '__bss_start'
]);

export function analyzeProgram(program) {
    const builtinModules = createBuiltinModules();
    const functionMaps = new Map();
    const dataSymbolMaps = new Map();
    const units = [program.rootUnit, ...program.modules.values()];
    for (const unit of units) {
        functionMaps.set(unit.moduleName, new Map());
        dataSymbolMaps.set(unit.moduleName, new Map());
    }

    for (const fn of program.functions) {
        if (RESERVED_IDENTIFIERS.has(fn.name)) {
            throw languageError('LANG001', `"${fn.name}" is a reserved keyword.`, fn);
        }
        if (fn.name === 'main' && fn.moduleName !== null) {
            throw languageError('LANG006', 'Imported modules cannot define the entry-point function "main".', fn);
        }
        const functions = functionMaps.get(fn.moduleName);
        const dataSymbols = dataSymbolMaps.get(fn.moduleName);
        if (functions.has(fn.name) || dataSymbols.has(fn.name)) {
            throw languageError('LANG006', `Function "${fn.name}" is already defined.`, fn);
        }
        functions.set(fn.name, fn);
    }

    for (const declaration of program.dataDeclarations) {
        if (RESERVED_IDENTIFIERS.has(declaration.name)) {
            throw languageError('LANG001', `"${declaration.name}" is a reserved keyword.`, declaration.nameSpan);
        }
        if (declaration.exported && declaration.section !== 'rodata') {
            throw languageError('LANG009', 'Only read-only data can be exported from a module.', declaration);
        }
        const functions = functionMaps.get(declaration.moduleName);
        const dataSymbols = dataSymbolMaps.get(declaration.moduleName);
        if (functions.has(declaration.name) || dataSymbols.has(declaration.name)) {
            throw languageError('LANG006', `Data symbol "${declaration.name}" is already defined.`, declaration.nameSpan);
        }
        if (declaration.size < 1 || declaration.size > 0xE00) {
            throw languageError('LANG010', 'Static data object size must be in the range 1..3584 bytes.', declaration.sizeSpan);
        }
        if (declaration.section === 'bss') {
            if (declaration.values !== null) {
                throw languageError('LANG002', 'BSS objects cannot have an initializer.', declaration);
            }
        } else {
            if (declaration.values.length !== declaration.size) {
                throw languageError('LANG002',
                    `Object "${declaration.name}" declares ${declaration.size} byte(s), but has ${declaration.values.length} initializer(s).`,
                    declaration);
            }
            for (const value of declaration.values) {
                if (value.value > 0xFF) {
                    throw languageError('LANG002', 'Static byte values must be in the range 0..255.', value);
                }
            }
        }
        dataSymbols.set(declaration.name, declaration);
    }

    const exportSymbolMaps = new Map(
        [...builtinModules].map(([moduleName, functions]) => [
            moduleName,
            new Map([...functions].map(([name, symbol]) => [name, { kind: 'function', symbol }]))
        ])
    );
    for (const [moduleName, functions] of functionMaps) {
        if (moduleName !== null) {
            const exports = new Map(
                [...functions]
                    .filter(([, fn]) => fn.exported)
                    .map(([name, symbol]) => [name, { kind: 'function', symbol }])
            );
            for (const [name, symbol] of dataSymbolMaps.get(moduleName)) {
                if (symbol.exported) exports.set(name, { kind: 'data', symbol });
            }
            exportSymbolMaps.set(moduleName, exports);
        }
    }

    for (const unit of units) {
        for (const [moduleName, imported] of unit.imports) {
            const exportedSymbols = exportSymbolMaps.get(moduleName);
            if (imported.all) continue;
            for (const name of imported.names) {
                if (!exportedSymbols?.has(name)) {
                    throw languageError('LANG003',
                        `Module "${moduleName}" does not export "${name}".`,
                        imported.span);
                }
            }
        }
    }

    const main = functionMaps.get(null).get('main');
    if (!main) {
        const rootProgram = program.rootUnit.program;
        const lastRootDeclaration = rootProgram.functions.at(-1) ??
            rootProgram.dataDeclarations.at(-1) ??
            rootProgram.imports.at(-1)?.span ??
            { line: 1, column: 1, ...(program.rootUnit.fileName ? { fileName: program.rootUnit.fileName } : {}) };
        throw languageError('LANG005',
            'The required function "fn u8 main()" is missing.',
            lastRootDeclaration);
    }
    if (main.returnType !== 'u8' || main.parameters.length !== 0) {
        throw languageError('LANG002', '"main" must have signature "fn u8 main()".', main);
    }

    const callGraph = new Map();
    for (const fn of program.functions) {
        const functions = new Map();
        for (const [name, target] of functionMaps.get(fn.moduleName)) {
            functions.set(name, target);
        }
        for (const [moduleName, imported] of fn.imports) {
            const exportedSymbols = exportSymbolMaps.get(moduleName);
            const names = imported.all ? exportedSymbols.keys() : imported.names;
            for (const name of names) {
                const exported = exportedSymbols.get(name);
                if (exported.kind === 'function') {
                    functions.set(`${moduleName}.${name}`, exported.symbol);
                }
            }
        }

        const argumentBytes = fn.parameters.reduce((total, parameter) =>
            total + (parameter.isArray ? 4 : 1), 0);
        if (argumentBytes > 126) {
            throw languageError('LANG009', 'Function arguments may occupy at most 126 stack bytes in the MVP ABI.', fn);
        }
        const scopes = [new Map()];
        fn.localCount = 0;
        fn.callSites = [];
        fn.dataSymbols = new Map(dataSymbolMaps.get(fn.moduleName));
        for (const [moduleName, imported] of fn.imports) {
            const exportedSymbols = exportSymbolMaps.get(moduleName);
            const names = imported.all ? exportedSymbols.keys() : imported.names;
            for (const name of names) {
                const exported = exportedSymbols.get(name);
                if (exported.kind === 'data') {
                    fn.dataSymbols.set(`${moduleName}.${name}`, exported.symbol);
                }
            }
        }
        let parameterOffset = -2 - argumentBytes;
        for (const parameter of fn.parameters) {
            if (RESERVED_IDENTIFIERS.has(parameter.name)) {
                throw languageError('LANG001', `"${parameter.name}" is a reserved keyword.`, parameter);
            }
            if (scopes[0].has(parameter.name)) {
                throw languageError('LANG006', `Identifier "${parameter.name}" is already defined in this scope.`, parameter);
            }
            parameter.kind = parameter.isArray ? 'arrayParameter' : 'scalarParameter';
            parameter.width = parameter.isArray ? 4 : 1;
            parameter.offset = parameterOffset;
            if (parameter.isArray) parameter.lengthOffset = parameterOffset + 2;
            parameterOffset += parameter.width;
            scopes[0].set(parameter.name, parameter);
        }
        analyzeBlock(fn.body, fn, functions, scopes, true);
        if (fn.returnType === 'u8' && !alwaysReturns(fn.body)) {
            throw languageError('LANG008', `Function "${fn.name}" must return a u8 value on every path.`, fn);
        }
        callGraph.set(fn.symbolName, fn.callSites);
    }

    rejectRecursion(program.functions, callGraph);
    const functions = new Map();
    for (const [moduleName, exports] of builtinModules) {
        for (const [name, fn] of exports) functions.set(`${moduleName}.${name}`, fn);
    }
    for (const fn of program.functions) functions.set(fn.symbolName, fn);
    return { functions, dataSymbols: dataSymbolMaps.get(null), main };
}

function analyzeBlock(block, fn, functions, scopes, reuseScope = false) {
    if (!reuseScope) scopes.push(new Map());
    for (const statement of block.statements) {
        analyzeStatement(statement, fn, functions, scopes);
    }
    if (!reuseScope) scopes.pop();
}

function analyzeStatement(statement, fn, functions, scopes) {
    switch (statement.kind) {
        case 'Block':
            analyzeBlock(statement, fn, functions, scopes);
            return;
        case 'VariableDeclaration': {
            if (RESERVED_IDENTIFIERS.has(statement.name)) {
                throw languageError('LANG001', `"${statement.name}" is a reserved keyword.`, statement);
            }
            const currentScope = scopes.at(-1);
            if (currentScope.has(statement.name)) {
                throw languageError('LANG006', `Identifier "${statement.name}" is already defined in this scope.`, statement);
            }
            const initializerType = analyzeExpression(statement.initializer, fn, functions, scopes);
            requireType(initializerType, statement.type, statement.initializer, 'Variable initializer');
            statement.offset = ++fn.localCount;
            if (statement.offset > 127) {
                throw languageError('LANG009', 'A function may allocate at most 127 local bytes in the MVP ABI.', statement);
            }
            currentScope.set(statement.name, statement);
            return;
        }
        case 'IfStatement':
            requireType(analyzeExpression(statement.condition, fn, functions, scopes), 'bool', statement.condition, 'if condition');
            analyzeBlock(statement.consequent, fn, functions, scopes);
            if (statement.alternate) analyzeBlock(statement.alternate, fn, functions, scopes);
            return;
        case 'WhileStatement':
            requireType(analyzeExpression(statement.condition, fn, functions, scopes), 'bool', statement.condition, 'while condition');
            analyzeBlock(statement.body, fn, functions, scopes);
            return;
        case 'ReturnStatement':
            if (fn.returnType === 'void' && statement.value) {
                throw languageError('LANG002', `Void function "${fn.name}" cannot return a value.`, statement);
            }
            if (fn.returnType === 'u8' && !statement.value) {
                throw languageError('LANG002', `Function "${fn.name}" must return a u8 value.`, statement);
            }
            if (statement.value) {
                requireType(analyzeExpression(statement.value, fn, functions, scopes), 'u8', statement.value, 'return value');
            }
            return;
        case 'ExpressionStatement': {
            const type = analyzeExpression(statement.expression, fn, functions, scopes);
            if (statement.expression.kind !== 'CallExpression' && statement.expression.kind !== 'Assignment') {
                throw languageError('LANG002', `A ${type} expression cannot be used as a statement.`, statement);
            }
            return;
        }
        case 'EmptyStatement':
            return;
        default:
            throw languageError('LANG009', `Unsupported statement "${statement.kind}".`, statement);
    }
}

function analyzeExpression(expression, fn, functions, scopes) {
    switch (expression.kind) {
        case 'NumberLiteral':
            if (expression.value > 0xFF) {
                throw languageError('LANG002', 'u8 integer literals must be in the range 0..255.', expression);
            }
            expression.type = 'u8';
            return expression.type;
        case 'CharacterLiteral':
            expression.type = 'u8';
            return expression.type;
        case 'BooleanLiteral':
            expression.type = 'bool';
            return expression.type;
        case 'Identifier': {
            const variable = resolveVariable(scopes, expression.name);
            if (variable?.kind === 'arrayParameter') {
                throw languageError('LANG002',
                    `Array parameter "${expression.name}" must be indexed or passed to another array parameter.`,
                    expression);
            }
            if (!variable && fn.dataSymbols.has(expression.name)) {
                throw languageError('LANG009',
                    `Static data symbol "${expression.name}" cannot be read in the current language version.`,
                    expression);
            }
            if (!variable) throw languageError('LANG003', `Variable "${expression.name}" is not defined in this scope.`, expression);
            expression.binding = variable;
            expression.type = variable.type;
            return expression.type;
        }
        case 'IndexExpression': {
            const variable = resolveVariable(scopes, expression.name);
            const target = variable ?? fn.dataSymbols.get(expression.name);
            if (!target) {
                throw languageError('LANG003', `Static data object "${expression.name}" is not defined.`, expression);
            }
            if (variable && variable.kind !== 'arrayParameter') {
                throw languageError('LANG002', `Local variable "${expression.name}" is not an array.`, expression);
            }
            requireType(analyzeExpression(expression.index, fn, functions, scopes),
                'u8', expression.index, 'Array index');
            if (target.kind !== 'arrayParameter') validateConstantIndex(expression.index, target);
            expression.binding = target;
            expression.type = 'u8';
            return expression.type;
        }
        case 'CallExpression': {
            const target = functions.get(expression.name);
            if (!target) throw languageError('LANG003', `Function "${expression.name}" is not defined.`, expression);
            expression.function = target;
            if (expression.arguments.length !== target.parameters.length) {
                throw languageError('LANG007', `Function "${expression.name}" expects ${target.parameters.length} argument(s), got ${expression.arguments.length}.`, expression);
            }
            expression.arguments.forEach((argument, index) => {
                const parameter = target.parameters[index];
                if (parameter.isArray) {
                    analyzeArrayArgument(argument, parameter, fn, scopes);
                } else {
                    const argumentType = analyzeExpression(argument, fn, functions, scopes);
                    requireType(argumentType, parameter.type, argument, `Argument ${index + 1}`);
                }
            });
            fn.callSites.push(expression);
            expression.type = target.returnType;
            return expression.type;
        }
        case 'Assignment': {
            if (expression.left.kind === 'IndexExpression') {
                const variable = resolveVariable(scopes, expression.left.name);
                const target = variable ?? fn.dataSymbols.get(expression.left.name);
                if (!target) {
                    throw languageError('LANG003',
                        `Static data object "${expression.left.name}" is not defined.`,
                        expression.left);
                }
                if (variable && variable.kind !== 'arrayParameter') {
                    throw languageError('LANG002',
                        `Local variable "${expression.left.name}" is not an array.`,
                        expression.left);
                }
                if (target.kind === 'arrayParameter' && !target.mutable) {
                    throw languageError('LANG002',
                        `Array parameter "${target.name}" is read-only; declare it with "mut" to assign elements.`,
                        expression.left);
                }
                requireType(analyzeExpression(expression.left.index, fn, functions, scopes),
                    'u8', expression.left.index, 'Array index');
                if (target.kind !== 'arrayParameter') validateConstantIndex(expression.left.index, target);
                requireType(analyzeExpression(expression.right, fn, functions, scopes),
                    'u8', expression.right, 'Assigned value');
                expression.left.binding = target;
                expression.type = 'u8';
                return expression.type;
            }
            if (expression.left.kind !== 'Identifier') {
                throw languageError('LANG002', 'The left side of an assignment must be a local variable.', expression.left);
            }
            const target = resolveVariable(scopes, expression.left.name);
            if (target?.kind === 'arrayParameter') {
                throw languageError('LANG002',
                    `Array parameter "${expression.left.name}" cannot be replaced; assign one of its elements.`,
                    expression.left);
            }
            if (!target && fn.dataSymbols.has(expression.left.name)) {
                throw languageError('LANG009',
                    `Static data symbol "${expression.left.name}" cannot be written in the current language version.`,
                    expression.left);
            }
            if (!target) throw languageError('LANG003', `Variable "${expression.left.name}" is not defined in this scope.`, expression.left);
            expression.left.binding = target;
            expression.left.type = target.type;
            const valueType = analyzeExpression(expression.right, fn, functions, scopes);
            requireType(valueType, target.type, expression.right, 'Assigned value');
            expression.type = target.type;
            return expression.type;
        }
        case 'UnaryExpression': {
            const operandType = analyzeExpression(expression.operand, fn, functions, scopes);
            const required = expression.operator === '!' ? 'bool' : 'u8';
            requireType(operandType, required, expression.operand, `Unary "${expression.operator}" operand`);
            expression.type = required;
            return expression.type;
        }
        case 'BinaryExpression': {
            const leftType = analyzeExpression(expression.left, fn, functions, scopes);
            const rightType = analyzeExpression(expression.right, fn, functions, scopes);
            const operator = expression.operator;
            if (['+', '-', '*', '/', '%'].includes(operator)) {
                requireType(leftType, 'u8', expression.left, `Left operand of "${operator}"`);
                requireType(rightType, 'u8', expression.right, `Right operand of "${operator}"`);
                expression.type = 'u8';
            } else if (['<', '>', '<=', '>='].includes(operator)) {
                requireType(leftType, 'u8', expression.left, `Left operand of "${operator}"`);
                requireType(rightType, 'u8', expression.right, `Right operand of "${operator}"`);
                expression.type = 'bool';
            } else if (operator === '==' || operator === '!=') {
                if (leftType !== rightType) {
                    throw languageError('LANG002', `"${operator}" operands must have the same type.`, expression);
                }
                expression.type = 'bool';
            } else if (operator === '&&' || operator === '||') {
                requireType(leftType, 'bool', expression.left, `Left operand of "${operator}"`);
                requireType(rightType, 'bool', expression.right, `Right operand of "${operator}"`);
                expression.type = 'bool';
            } else {
                throw languageError('LANG009', `Operator "${operator}" is not supported.`, expression);
            }
            return expression.type;
        }
        default:
            throw languageError('LANG009', `Unsupported expression "${expression.kind}".`, expression);
    }
}

function validateConstantIndex(index, target) {
    const constantIndex = constantU8Value(index);
    if (constantIndex !== null && constantIndex >= target.size) {
        throw languageError('LANG002',
            `Index ${constantIndex} is outside "${target.name}" (length ${target.size}).`,
            index);
    }
}

function analyzeArrayArgument(argument, parameter, fn, scopes) {
    if (argument.kind !== 'Identifier') {
        throw languageError('LANG002', `Argument ${parameter.name} must be a static array or array parameter.`, argument);
    }

    const variable = resolveVariable(scopes, argument.name);
    const target = variable ?? fn.dataSymbols.get(argument.name);
    if (!target) {
        throw languageError('LANG003', `Array "${argument.name}" is not defined.`, argument);
    }
    if (variable && variable.kind !== 'arrayParameter') {
        throw languageError('LANG002', `Local variable "${argument.name}" is not an array.`, argument);
    }
    if (parameter.mutable &&
        ((target.kind === 'arrayParameter' && !target.mutable) ||
            (target.kind !== 'arrayParameter' && target.section === 'rodata'))) {
        throw languageError('LANG002',
            `Argument for mutable array parameter "${parameter.name}" must be writable.`,
            argument);
    }
    if (target.kind !== 'arrayParameter' &&
        ((parameter.minLength !== undefined && target.size < parameter.minLength) ||
            (parameter.maxLength !== undefined && target.size > parameter.maxLength))) {
        const range = parameter.minLength !== undefined
            ? `at least ${parameter.minLength}`
            : `at most ${parameter.maxLength}`;
        throw languageError('LANG002',
            `Array "${argument.name}" must contain ${range} byte(s).`,
            argument);
    }

    argument.arrayBinding = target;
}

function constantU8Value(expression) {
    if (expression.kind === 'NumberLiteral' || expression.kind === 'CharacterLiteral') {
        return expression.value;
    }

    if (expression.kind === 'UnaryExpression' && expression.operator === '-') {
        const operand = constantU8Value(expression.operand);
        return operand === null ? null : (-operand) & 0xFF;
    }

    if (expression.kind !== 'BinaryExpression' ||
        !['+', '-', '*', '/', '%'].includes(expression.operator)) {
        return null;
    }

    const left = constantU8Value(expression.left);
    const right = constantU8Value(expression.right);
    if (left === null || right === null || (right === 0 && ['/', '%'].includes(expression.operator))) {
        return null;
    }

    switch (expression.operator) {
        case '+': return (left + right) & 0xFF;
        case '-': return (left - right) & 0xFF;
        case '*': return (left * right) & 0xFF;
        case '/': return Math.floor(left / right);
        case '%': return left % right;
    }
}

function resolveVariable(scopes, name) {
    for (let index = scopes.length - 1; index >= 0; index--) {
        const variable = scopes[index].get(name);
        if (variable) return variable;
    }
    return null;
}

function requireType(actual, expected, node, context) {
    if (actual !== expected) {
        throw languageError('LANG002', `${context} must have type ${expected}, got ${actual}.`, node);
    }
}

function alwaysReturns(statement) {
    if (statement.kind === 'ReturnStatement') return true;
    if (statement.kind === 'Block') {
        return statement.statements.some((child) => alwaysReturns(child));
    }
    if (statement.kind === 'IfStatement') {
        return Boolean(statement.alternate) &&
            alwaysReturns(statement.consequent) &&
            alwaysReturns(statement.alternate);
    }
    return false;
}

function rejectRecursion(functions, callGraph) {
    const states = new Map();
    const path = [];

    const visit = (name) => {
        states.set(name, 1);
        path.push(name);
        for (const call of callGraph.get(name) ?? []) {
            if (call.function.kind === 'BuiltinFunction') continue;
            const target = call.function.symbolName;
            if (states.get(target) === 1) {
                throw languageError('LANG004', `Recursive call cycle: ${[...path.slice(path.indexOf(target)), target].join(' -> ')}.`, call);
            }
            if (!states.has(target)) visit(target);
        }
        path.pop();
        states.set(name, 2);
    };

    for (const fn of functions) {
        if (!states.has(fn.symbolName)) visit(fn.symbolName);
    }
}

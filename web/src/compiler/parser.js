import { languageError } from './errors.js';

const BINARY_PRECEDENCE = new Map([
    ['=', 1],
    ['||', 2],
    ['&&', 3],
    ['==', 4], ['!=', 4],
    ['<', 5], ['>', 5], ['<=', 5], ['>=', 5],
    ['+', 6], ['-', 6],
    ['*', 7], ['/', 7], ['%', 7]
]);

export class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.position = 0;
    }

    current() {
        return this.tokens[this.position];
    }

    at(value) {
        return this.current().value === value;
    }

    consume() {
        return this.tokens[this.position++];
    }

    expect(value, message = `Expected "${value}".`) {
        if (!this.at(value)) throw languageError('LANG001', message, this.current());
        return this.consume();
    }

    expectIdentifier(message = 'Expected an identifier.') {
        const token = this.current();
        if (token.kind !== 'identifier') throw languageError('LANG001', message, token);
        return this.consume();
    }

    parseProgram() {
        const functions = [];
        const dataDeclarations = [];
        const imports = [];
        while (this.current().kind !== 'eof') {
            if (this.at('import')) {
                imports.push(...this.parseImportDeclaration());
            } else if (['data', 'rodata', 'bss'].includes(this.current().value)) {
                dataDeclarations.push(this.parseDataDeclaration());
            } else if (this.at('pub')) {
                const modifier = this.consume();
                if (this.at('fn')) {
                    functions.push(this.parseFunction(true));
                } else if (this.at('rodata')) {
                    dataDeclarations.push(this.parseDataDeclaration(true));
                } else {
                    throw languageError('LANG009', '"pub" can only export functions or read-only data.', modifier);
                }
            } else {
                functions.push(this.parseFunction());
            }
        }
        return { kind: 'Program', imports, functions, dataDeclarations };
    }

    parseImportDeclaration() {
        this.consume();
        const imports = [];
        do {
            const module = this.expectIdentifier('Expected a module name after "import".');
            let name = null;
            if (this.at('.')) {
                this.consume();
                name = this.expectIdentifier('Expected an exported function name.').value;
            }
            imports.push({ moduleName: module.value, name, span: module.span });
            if (!this.at(',')) break;
            this.consume();
        } while (true);
        this.expect(';');
        return imports;
    }

    parseDataDeclaration(exported = false) {
        const section = this.consume();
        const type = this.expectIdentifier('Expected data type "u8".');
        if (type.value !== 'u8') {
            throw languageError('LANG002', 'Static data objects must have type u8.', type);
        }

        const name = this.expectIdentifier('Expected a data object name.');
        this.expect('[');
        const size = this.current();
        if (size.kind !== 'number') {
            throw languageError('LANG001', 'Expected a fixed data object size.', size);
        }
        this.consume();
        this.expect(']');

        let values = null;
        if (section.value === 'bss') {
            if (this.at('=')) {
                throw languageError('LANG002', 'BSS objects cannot have an initializer.', this.current());
            }
        } else {
            this.expect('=');
            this.expect('[');
            values = [];
            if (!this.at(']')) {
                do {
                    const value = this.current();
                    if (value.kind !== 'number' && value.kind !== 'character') {
                        throw languageError('LANG001', 'Data initializers must be u8 or character literals.', value);
                    }
                    this.consume();
                    values.push({
                        kind: value.kind === 'number' ? 'NumberLiteral' : 'CharacterLiteral',
                        value: value.value,
                        span: value.span
                    });
                    if (!this.at(',')) break;
                    this.consume();
                } while (!this.at(']'));
            }
            this.expect(']');
        }
        this.expect(';');

        return {
            kind: 'DataDeclaration',
            section: section.value,
            type: type.value,
            name: name.value,
            exported,
            size: size.value,
            values,
            span: section.span,
            nameSpan: name.span,
            sizeSpan: size.span
        };
    }

    parseFunction(exported = false) {
        const start = this.expect('fn');
        let returnType = 'void';
        if (this.at('u8')) {
            this.consume();
            returnType = 'u8';
        }

        const name = this.expectIdentifier('Expected a function name.');
        this.expect('(');
        const parameters = [];
        if (!this.at(')')) {
            do {
                const mutable = this.at('mut') ? this.consume() : null;
                const parameterName = this.expectIdentifier('Expected a parameter name.');
                this.expect(':');
                const parameterType = this.expectIdentifier('Expected parameter type "u8".');
                if (parameterType.value !== 'u8') {
                    throw languageError('LANG002', 'Function parameters must have type u8.', parameterType);
                }
                const isArray = this.at('[');
                if (isArray) {
                    this.consume();
                    this.expect(']');
                } else if (mutable) {
                    throw languageError('LANG001', '"mut" is only valid for array parameters.', mutable);
                }
                parameters.push({
                    name: parameterName.value,
                    type: parameterType.value,
                    isArray,
                    mutable: Boolean(mutable),
                    span: parameterName.span
                });
                if (!this.at(',')) break;
                this.consume();
            } while (!this.at(')'));
        }
        this.expect(')');
        const body = this.parseBlock();
        return {
            kind: 'Function',
            name: name.value,
            exported,
            returnType,
            parameters,
            body,
            span: start.span
        };
    }

    parseBlock() {
        const open = this.expect('{');
        const statements = [];
        while (!this.at('}') && this.current().kind !== 'eof') {
            statements.push(this.parseStatement());
        }
        this.expect('}', 'Expected "}" to close this block.');
        return { kind: 'Block', statements, span: open.span };
    }

    parseStatement() {
        const token = this.current();
        if (this.at('{')) return this.parseBlock();

        if (this.at('u8') || this.at('bool')) {
            const type = this.consume();
            const name = this.expectIdentifier('Expected a variable name.');
            this.expect('=', 'Variable declarations require an initializer.');
            const initializer = this.parseExpression();
            this.expect(';');
            return {
                kind: 'VariableDeclaration',
                name: name.value,
                type: type.value,
                initializer,
                span: type.span
            };
        }

        if (this.at('if')) {
            const start = this.consume();
            this.expect('(');
            const condition = this.parseExpression();
            this.expect(')');
            const consequent = this.parseBlock();
            const alternate = this.at('else') ? (this.consume(), this.parseBlock()) : null;
            return { kind: 'IfStatement', condition, consequent, alternate, span: start.span };
        }

        if (this.at('while')) {
            const start = this.consume();
            this.expect('(');
            const condition = this.parseExpression();
            this.expect(')');
            const body = this.parseBlock();
            return { kind: 'WhileStatement', condition, body, span: start.span };
        }

        if (this.at('return')) {
            const start = this.consume();
            const value = this.at(';') ? null : this.parseExpression();
            this.expect(';');
            return { kind: 'ReturnStatement', value, span: start.span };
        }

        if (this.at(';')) {
            this.consume();
            return { kind: 'EmptyStatement', span: token.span };
        }

        const expression = this.parseExpression();
        this.expect(';');
        return { kind: 'ExpressionStatement', expression, span: token.span };
    }

    parseExpression(minimumPrecedence = 1) {
        let left = this.parseUnary();

        while (true) {
            const operator = this.current().value;
            const precedence = BINARY_PRECEDENCE.get(operator);
            if (precedence === undefined || precedence < minimumPrecedence) break;
            const operatorToken = this.consume();
            const rightAssociative = operator === '=';
            const right = this.parseExpression(precedence + (rightAssociative ? 0 : 1));
            left = {
                kind: operator === '=' ? 'Assignment' : 'BinaryExpression',
                operator,
                left,
                right,
                span: operatorToken.span
            };
        }
        return left;
    }

    parseUnary() {
        if (this.at('!') || this.at('-')) {
            const operator = this.consume();
            return {
                kind: 'UnaryExpression',
                operator: operator.value,
                operand: this.parseUnary(),
                span: operator.span
            };
        }
        return this.parsePrimary();
    }

    parsePrimary() {
        const token = this.current();
        if (token.kind === 'number') {
            this.consume();
            return { kind: 'NumberLiteral', value: token.value, span: token.span };
        }

        if (token.kind === 'character') {
            this.consume();
            return { kind: 'CharacterLiteral', value: token.value, span: token.span };
        }

        if (token.kind === 'identifier') {
            this.consume();
            if (token.value === 'true' || token.value === 'false') {
                return { kind: 'BooleanLiteral', value: token.value === 'true', span: token.span };
            }
            let name = token.value;
            if (this.at('.')) {
                this.consume();
                const member = this.expectIdentifier('Expected a function name after the module qualifier.');
                name = `${name}.${member.value}`;
            }
            if (this.at('(')) {
                this.consume();
                const argumentsList = [];
                if (!this.at(')')) {
                    do {
                        argumentsList.push(this.parseExpression());
                        if (!this.at(',')) break;
                        this.consume();
                    } while (!this.at(')'));
                }
                this.expect(')');
                return {
                    kind: 'CallExpression',
                    name,
                    arguments: argumentsList,
                    span: token.span
                };
            }
            if (this.at('[')) {
                this.consume();
                const index = this.parseExpression();
                this.expect(']');
                return {
                    kind: 'IndexExpression',
                    name,
                    index,
                    span: token.span
                };
            }
            return { kind: 'Identifier', name, span: token.span };
        }

        if (this.at('(')) {
            this.consume();
            const expression = this.parseExpression();
            this.expect(')');
            return expression;
        }

        throw languageError('LANG001', 'Expected an expression.', token);
    }
}

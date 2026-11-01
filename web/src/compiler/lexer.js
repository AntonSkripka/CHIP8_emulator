import { languageError } from './errors.js';

const TWO_CHARACTER_TOKENS = new Set(['==', '!=', '<=', '>=', '&&', '||']);
const SINGLE_CHARACTER_TOKENS = new Set('(){}[]:;,.=+-*/%!<>');

export function tokenize(source, fileName = null) {
    if (typeof source !== 'string') {
        throw new TypeError('CHIP Language source must be a string.');
    }

    const tokens = [];
    let offset = 0;
    let line = 1;
    let column = 1;

    const advance = () => {
        const character = source[offset++];
        if (character === '\n') {
            line++;
            column = 1;
        } else {
            column++;
        }
        return character;
    };

    const peek = (distance = 0) => source[offset + distance] ?? '';

    while (offset < source.length) {
        const character = peek();
        if (/\s/.test(character)) {
            advance();
            continue;
        }

        if (character === '/' && peek(1) === '/') {
            while (offset < source.length && advance() !== '\n') {}
            continue;
        }

        if (character === '/' && peek(1) === '*') {
            const span = makeSpan(line, column, fileName);
            advance();
            advance();
            let closed = false;
            while (offset < source.length) {
                if (peek() === '*' && peek(1) === '/') {
                    advance();
                    advance();
                    closed = true;
                    break;
                }
                advance();
            }
            if (!closed) throw languageError('LANG001', 'Unterminated block comment.', span);
            continue;
        }

        const span = makeSpan(line, column, fileName);
        if (character === "'") {
            advance();
            if (offset >= source.length || peek() === "'" || peek() === '\n' || peek() === '\r') {
                throw languageError('LANG001', 'Expected one byte character literal.', span);
            }

            let value;
            if (peek() === '\\') {
                advance();
                const escape = advance();
                const escapes = {
                    n: 0x0A,
                    r: 0x0D,
                    t: 0x09,
                    0: 0x00,
                    '\\': 0x5C,
                    "'": 0x27
                };
                if (escape === 'x') {
                    const digits = peek() + peek(1);
                    if (!/^[0-9A-Fa-f]{2}$/.test(digits)) {
                        throw languageError('LANG001', 'Expected two hexadecimal digits after \\x.', span);
                    }
                    advance();
                    advance();
                    value = Number.parseInt(digits, 16);
                } else if (Object.hasOwn(escapes, escape)) {
                    value = escapes[escape];
                } else {
                    throw languageError('LANG001', `Unsupported character escape "\\${escape}".`, span);
                }
            } else {
                const codePoint = source.codePointAt(offset);
                if (codePoint < 0x20 || codePoint > 0x7E) {
                    throw languageError('LANG001',
                        'Direct character literals must contain one printable ASCII character; use \\xNN for other bytes.',
                        span);
                }
                value = codePoint;
                advance();
            }

            if (peek() !== "'") {
                throw languageError('LANG001', 'Character literals must contain exactly one byte.', span);
            }
            advance();
            tokens.push({ kind: 'character', value, span });
            continue;
        }

        if (/[A-Za-z_]/.test(character)) {
            let value = '';
            while (/[A-Za-z0-9_]/.test(peek())) value += advance();
            tokens.push({ kind: 'identifier', value, span });
            continue;
        }

        if (/[0-9]/.test(character)) {
            let value = '';
            if (character === '0' && (peek(1) === 'x' || peek(1) === 'X')) {
                value += advance();
                value += advance();
                if (!/[0-9A-Fa-f]/.test(peek())) {
                    throw languageError('LANG001', 'Expected hexadecimal digits after 0x.', span);
                }
                while (/[0-9A-Fa-f]/.test(peek())) value += advance();
            } else {
                while (/[0-9]/.test(peek())) value += advance();
            }
            const numericValue = Number(value.toLowerCase().startsWith('0x')
                ? Number.parseInt(value.slice(2), 16)
                : Number.parseInt(value, 10));
            if (numericValue > 0xFFFF) {
                throw languageError('LANG002', 'Integer literals must not exceed 65535.', span);
            }
            tokens.push({ kind: 'number', value: numericValue, raw: value, span });
            continue;
        }

        const pair = character + peek(1);
        if (TWO_CHARACTER_TOKENS.has(pair)) {
            advance();
            advance();
            tokens.push({ kind: 'symbol', value: pair, span });
            continue;
        }
        if (SINGLE_CHARACTER_TOKENS.has(character)) {
            advance();
            tokens.push({ kind: 'symbol', value: character, span });
            continue;
        }

        throw languageError('LANG001', `Unexpected character "${character}".`, span);
    }

    tokens.push({ kind: 'eof', value: '<eof>', span: makeSpan(line, column, fileName) });
    return tokens;
}

function makeSpan(line, column, fileName) {
    return fileName ? { line, column, fileName } : { line, column };
}

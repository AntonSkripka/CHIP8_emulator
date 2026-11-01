const DEFAULT_ORIGIN = 0x200;
const MEMORY_SIZE = 0x1000;
const LABEL_PATTERN = /^[A-Z_][A-Z0-9_]*$/;
const EXTENDED_INSTRUCTIONS = new Set(['ENTER', 'LEAVE', 'ADJSP', 'DROP', 'LDX', 'STX', 'TRAP', 'LDI', 'SYS']);
const CONDITIONAL_SKIPS = new Set(['SE', 'SNE', 'SKP', 'SKNP']);

export class AssemblerError extends Error {
    constructor(message, line, sourceLine) {
        super(`Line ${line}: ${message}`);
        this.name = 'AssemblerError';
        this.line = line;
        this.sourceLine = sourceLine;
    }
}

function fail(statement, message) {
    throw new AssemblerError(message, statement.line, statement.source);
}

function parseNumber(token) {
    if (/^-?0x[0-9A-F]+$/i.test(token)) {
        const negative = token.startsWith('-');
        const digits = negative ? token.slice(3) : token.slice(2);
        const value = Number.parseInt(digits, 16);
        return negative ? -value : value;
    }
    if (/^-?\d+$/.test(token)) return Number.parseInt(token, 10);
    return NaN;
}

function parseRegister(token) {
    const match = /^V([0-9A-F])$/.exec(token);
    return match ? Number.parseInt(match[1], 16) : null;
}

function expectArgumentCount(statement, args, expected) {
    if (args.length !== expected) {
        fail(statement, `${statement.tokens[0]} expects ${expected} argument${expected === 1 ? '' : 's'}, got ${args.length}.`);
    }
}

function requireRegister(statement, token) {
    const register = parseRegister(token);
    if (register === null) fail(statement, `Invalid register "${token}"; expected V0 through VF.`);
    return register;
}

function requireNumber(statement, token, min, max, description) {
    const value = parseNumber(token);
    if (!Number.isSafeInteger(value) || value < min || value > max) {
        fail(statement, `Invalid ${description} "${token}"; expected a value from ${min} to ${max}.`);
    }
    return value;
}

function resolveAddress(statement, token, labels) {
    const value = labels.get(token.toUpperCase()) ?? parseNumber(token);
    if (!Number.isSafeInteger(value) || value < 0 || value >= MEMORY_SIZE) {
        fail(statement, `Unknown label or invalid address "${token}".`);
    }
    return value;
}

function encodeExtendedInstruction(statement) {
    const [rawInstruction, ...args] = statement.tokens;
    const instruction = rawInstruction.toUpperCase();
    const immediate = (min, max, description) => requireNumber(statement, args[0], min, max, description);

    switch (instruction) {
        case 'ENTER':
            expectArgumentCount(statement, args, 0);
            return [0x5001, 0x0000];
        case 'LEAVE':
            expectArgumentCount(statement, args, 0);
            return [0x5001, 0x0100];
        case 'ADJSP':
            expectArgumentCount(statement, args, 1);
            return [0x5001, 0x0200 | immediate(0, 0xFF, 'stack adjustment')];
        case 'DROP':
            expectArgumentCount(statement, args, 1);
            return [0x5001, 0x0300 | immediate(0, 0xFF, 'stack adjustment')];
        case 'LDX':
            expectArgumentCount(statement, args, 1);
            return [0x5001, 0x0400 | (immediate(-128, 127, 'signed frame offset') & 0xFF)];
        case 'STX':
            expectArgumentCount(statement, args, 1);
            return [0x5001, 0x0500 | (immediate(-128, 127, 'signed frame offset') & 0xFF)];
        case 'LDI':
            expectArgumentCount(statement, args, 1);
            return [0x5001, 0x0700 | (immediate(-128, 127, 'signed frame offset') & 0xFF)];
        case 'TRAP':
            expectArgumentCount(statement, args, 1);
            return [0x5001, 0x0600 | immediate(0, 0xFF, 'runtime fault code')];
        case 'SYS':
            expectArgumentCount(statement, args, 1);
            return [0x5001, 0x0800 | immediate(0, 0xFF, 'system call operation')];
    }
}

function encodeInstruction(statement, labels) {
    const [rawInstruction, ...args] = statement.tokens;
    const instruction = rawInstruction.toUpperCase();
    const reg = (index) => requireRegister(statement, args[index]);
    const byte = (index) => requireNumber(statement, args[index], -128, 255, '8-bit value') & 0xFF;
    const pair = (opcode, x = reg(0), y = reg(1)) => opcode | (x << 8) | (y << 4);

    switch (instruction) {
        case 'CLS':
            expectArgumentCount(statement, args, 0);
            return 0x00E0;
        case 'RET':
            expectArgumentCount(statement, args, 0);
            return 0x00EE;
        case 'JP':
            if (args.length === 1) return 0x1000 | resolveAddress(statement, args[0], labels);
            expectArgumentCount(statement, args, 2);
            if (args[0].toUpperCase() !== 'V0') fail(statement, 'The indexed JP form is JP V0, address.');
            return 0xB000 | resolveAddress(statement, args[1], labels);
        case 'CALL':
            expectArgumentCount(statement, args, 1);
            return 0x2000 | resolveAddress(statement, args[0], labels);
        case 'SE':
        case 'SNE': {
            expectArgumentCount(statement, args, 2);
            const x = reg(0);
            const y = parseRegister(args[1]);
            if (y !== null) return (instruction === 'SE' ? 0x5000 : 0x9000) | (x << 8) | (y << 4);
            return (instruction === 'SE' ? 0x3000 : 0x4000) | (x << 8) | byte(1);
        }
        case 'LD':
            return encodeLoad(statement, args, labels);
        case 'ADD': {
            expectArgumentCount(statement, args, 2);
            if (args[0].toUpperCase() === 'I') return 0xF01E | (reg(1) << 8);
            const x = reg(0);
            const y = parseRegister(args[1]);
            return y !== null
                ? 0x8004 | (x << 8) | (y << 4)
                : 0x7000 | (x << 8) | byte(1);
        }
        case 'OR':
            expectArgumentCount(statement, args, 2);
            return pair(0x8001);
        case 'AND':
            expectArgumentCount(statement, args, 2);
            return pair(0x8002);
        case 'XOR':
            expectArgumentCount(statement, args, 2);
            return pair(0x8003);
        case 'SUB':
            expectArgumentCount(statement, args, 2);
            return pair(0x8005);
        case 'SUBN':
            expectArgumentCount(statement, args, 2);
            return pair(0x8007);
        case 'MUL':
            expectArgumentCount(statement, args, 2);
            return pair(0xF00C);
        case 'DIV':
            expectArgumentCount(statement, args, 2);
            return pair(0xF00D);
        case 'REM':
            expectArgumentCount(statement, args, 2);
            return pair(0xF00F);
        case 'SHR':
            expectArgumentCount(statement, args, 1);
            return 0x8006 | (reg(0) << 8);
        case 'SHL':
            expectArgumentCount(statement, args, 1);
            return 0x800E | (reg(0) << 8);
        case 'RND':
            expectArgumentCount(statement, args, 2);
            return 0xC000 | (reg(0) << 8) | byte(1);
        case 'DRW':
            expectArgumentCount(statement, args, 3);
            return 0xD000 | (reg(0) << 8) | (reg(1) << 4) |
                requireNumber(statement, args[2], 0, 15, 'sprite height');
        case 'PUSH':
            expectArgumentCount(statement, args, 1);
            return 0xF0F1 | (reg(0) << 8);
        case 'POP':
            expectArgumentCount(statement, args, 1);
            return 0xF0F2 | (reg(0) << 8);
        case 'PUSHA':
            expectArgumentCount(statement, args, 0);
            return 0xF0F3;
        case 'POPA':
            expectArgumentCount(statement, args, 0);
            return 0xF0F4;
        case 'PEAK':
            expectArgumentCount(statement, args, 1);
            return 0xF0F5 | (reg(0) << 8);
        case 'SIZESTACK':
            expectArgumentCount(statement, args, 1);
            return 0xF0F6 | (reg(0) << 8);
        case 'CLEARSTACK':
            expectArgumentCount(statement, args, 0);
            return 0xF0F7;
        case 'SKP':
            expectArgumentCount(statement, args, 1);
            return 0xE09E | (reg(0) << 8);
        case 'SKNP':
            expectArgumentCount(statement, args, 1);
            return 0xE0A1 | (reg(0) << 8);
        default:
            fail(statement, `Unknown instruction or directive "${rawInstruction}".`);
    }
}

function encodeLoad(statement, args, labels) {
    expectArgumentCount(statement, args, 2);
    const destination = args[0].toUpperCase();
    const source = args[1].toUpperCase();

    if (destination === 'I') return 0xA000 | resolveAddress(statement, args[1], labels);
    if (destination === 'DT' || destination === 'ST' || destination === 'F' || destination === 'B') {
        const x = requireRegister(statement, source);
        const opcode = { DT: 0xF015, ST: 0xF018, F: 0xF029, B: 0xF033 }[destination];
        return opcode | (x << 8);
    }
    if (destination === '[I]') return 0xF055 | (requireRegister(statement, source) << 8);

    const x = requireRegister(statement, destination);
    if (source === 'DT') return 0xF007 | (x << 8);
    if (source === 'K') return 0xF00A | (x << 8);
    if (source === '[I]') return 0xF065 | (x << 8);

    const y = parseRegister(source);
    if (y !== null) return 0x8000 | (x << 8) | (y << 4);
    return 0x6000 | (x << 8) | requireNumber(statement, args[1], -128, 255, '8-bit value');
}

function tokenize(line) {
    if (/,\s*,|^\s*,|,\s*$/.test(line)) return null;
    return line.replaceAll(',', ' ').trim().split(/\s+/).filter(Boolean);
}

export function asmToBin(code) {
    if (typeof code !== 'string') {
        throw new TypeError('Assembly source must be a string.');
    }

    const labels = new Map();
    const statements = [];
    let address = DEFAULT_ORIGIN;
    const lines = code.replace(/\r/g, '').split('\n');

    for (let index = 0; index < lines.length; index++) {
        const source = lines[index].split(';', 1)[0].trim();
        if (!source) continue;

        const statement = { line: index + 1, source, tokens: [], address, size: 0 };
        let body = source;
        const colon = body.indexOf(':');
        if (colon !== -1) {
            const label = body.slice(0, colon).trim().toUpperCase();
            if (!LABEL_PATTERN.test(label)) fail(statement, `Invalid label "${body.slice(0, colon).trim()}".`);
            if (labels.has(label)) fail(statement, `Duplicate label "${label}".`);
            labels.set(label, address);
            body = body.slice(colon + 1).trim();
            if (!body) continue;
        }

        const tokens = tokenize(body);
        if (!tokens || tokens.length === 0) fail(statement, 'Malformed argument separators.');
        statement.tokens = tokens;
        const operation = tokens[0].toUpperCase();

        if (operation === 'ORG') {
            expectArgumentCount(statement, tokens.slice(1), 1);
            address = requireNumber(statement, tokens[1], 0, MEMORY_SIZE - 1, 'origin');
            continue;
        }

        statement.address = address;
        statement.size = operation === 'DB'
            ? tokens.length - 1
            : EXTENDED_INSTRUCTIONS.has(operation) ? 4 : 2;
        if (operation === 'DB' && statement.size === 0) fail(statement, 'DB expects at least one byte value.');
        if (address + statement.size > MEMORY_SIZE) {
            fail(statement, 'The statement exceeds the 4 KiB CHIP-8 address space.');
        }
        statements.push(statement);
        address += statement.size;
    }

    for (let index = 0; index + 1 < statements.length; index++) {
        const statement = statements[index];
        const next = statements[index + 1];
        const operation = statement.tokens[0].toUpperCase();
        const nextOperation = next.tokens[0].toUpperCase();
        if (CONDITIONAL_SKIPS.has(operation) &&
            EXTENDED_INSTRUCTIONS.has(nextOperation) &&
            statement.address + statement.size === next.address) {
            fail(next, 'A CHIP-8 skip instruction cannot target a chip8-dev extended instruction.');
        }
    }

    const occupied = new Set();
    const segments = [];
    let currentSegment = null;

    for (const statement of statements) {
        if (!currentSegment || statement.address !== currentSegment.start + getSegmentSize(currentSegment)) {
            if (currentSegment) segments.push(currentSegment);
            currentSegment = { start: statement.address, bytes: [] };
        }

        const operation = statement.tokens[0].toUpperCase();
        const values = operation === 'DB'
            ? statement.tokens.slice(1).map((token) =>
                requireNumber(statement, token, -128, 255, 'byte value') & 0xFF)
            : EXTENDED_INSTRUCTIONS.has(operation)
                ? encodeExtendedInstruction(statement)
                : [encodeInstruction(statement, labels)];

        for (let index = 0; index < statement.size; index++) {
            const byteAddress = statement.address + index;
            if (occupied.has(byteAddress)) fail(statement, `Address 0x${byteAddress.toString(16).toUpperCase()} is defined more than once.`);
            occupied.add(byteAddress);
        }

        for (const value of values) {
            currentSegment.bytes.push({
                val: value,
                size: operation === 'DB' ? 1 : 2
            });
        }
    }

    if (currentSegment) segments.push(currentSegment);
    return segments;
}

function getSegmentSize(seg) {
    return seg.bytes.reduce((acc, b) => acc + b.size, 0);
}

function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function highlightCode(text) {
    const keywords = [
        'CLS', 'RET', 'JP', 'CALL', 'SE', 'SNE', 'LD', 'ADD', 'OR', 'AND', 'XOR', 
        'SUB', 'SHR', 'SUBN', 'SHL', 'RND', 'DRW', 'PUSH', 'POP', 'SKP', 'SKNP', 'DB', 'ORG',
        'PUSHA', 'POPA', 'SIZESTACK', 'PEAK', 'CLEARSTACK', 'MUL', 'DIV', 'REM',
        'ENTER', 'LEAVE', 'ADJSP', 'DROP', 'LDX', 'STX', 'LDI', 'TRAP', 'SYS'
    ];
    const registers = [
        'V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 
        'VA', 'VB', 'VC', 'VD', 'VE', 'VF', 'I', 'DT', 'ST'
    ];

    let escaped = escapeHtml(text);

    const regex = new RegExp(`\\b(${[...keywords, ...registers].join('|')})\\b`, 'gi');

    let highlighted = escaped.replace(regex, match => {
        const upper = match.toUpperCase();
        if (keywords.includes(upper)) {
            return `<span class="keyword">${match}</span>`;
        }
        if (registers.includes(upper)) {
            return `<span class="register">${match}</span>`;
        }
        return match;
    });

    if (text.endsWith('\n')) {
        highlighted += ' ';
    }

    return highlighted;
}

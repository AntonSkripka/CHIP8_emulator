const commandTable = {
    'CLS': 0x00E0,
    'RET': 0x00EE,
    'JP': 0x1000,
    'CALL': 0x2000,
    'SE': 0x3000,
    'SNE': 0x4000,
    'PUSH': 0x5001,
    'POP': 0x5002,
    'OR': 0x8001,
    'AND': 0x8002,
    'XOR': 0x8003,
    'SUB': 0x8005,
    'SHR': 0x8006,
    'SUBN': 0x8007,
    'SHL': 0x800E,
    'RND': 0xC000,
    'DRW': 0xD000,
    'SKP': 0xE09E,
    'SKNP': 0xE0A1
};

const defaultOrigin = 0x200;

function parseNumber(token) {
    if (typeof token === 'number') return token;
    if (typeof token !== 'string') return NaN;
    const value = token.trim();

    if (/^0x[0-9A-F]+$/i.test(value)) {
        return parseInt(value, 16);
    }
    if (/^\d+$/.test(value)) {
        return parseInt(value, 10);
    }
    return NaN;
}

function maskNumericValue(value, opcodeBase, tokenIndex) {
    if (typeof value !== 'number') return value;
    if (tokenIndex === 0) return value;
    const highNibble = opcodeBase & 0xF000;
    if (highNibble === 0x1000 || highNibble === 0x2000 || highNibble === 0xA000 || highNibble === 0xB000) {
        return value & 0x0FFF;
    }
    if (highNibble === 0x3000 || highNibble === 0x4000 || highNibble === 0x6000 || highNibble === 0x7000 || highNibble === 0xC000) {
        return value & 0x00FF;
    }
    if (highNibble === 0xD000) {
        return value & 0x000F;
    }
    return value;
}

export function asmToBin(code) {
    const labels = {};
    const cleanCode = code.replace(/\r/g, "").replace(/\s*;[^\n\r]*/g, "").trim();
    const lines = cleanCode.split("\n").map(l => l.trim()).filter(l => l.length > 0);

    let currentAddr = defaultOrigin;
    const instructionLines = [];

    for (const line of lines) {
        const tokens = line.replaceAll(",", " ").split(/\s+/).filter(Boolean);
        const cmd = tokens[0].toUpperCase();

        if (cmd.endsWith(':')) {
            labels[cmd.slice(0, -1)] = currentAddr;
            continue;
        }

        if (cmd === 'ORG') {
            const val = parseNumber(tokens[1]);
            if (!isNaN(val)) currentAddr = val;
            continue;
        }

        if (cmd === 'DB') {
            instructionLines.push({ tokens, addr: currentAddr, type: 'DB' });
            currentAddr += tokens.length - 1;
        } else {
            instructionLines.push({ tokens, addr: currentAddr, type: 'INST' });
            currentAddr += 2;
        }
    }

    const segments = [];
    let currentSegment = null;

    for (const line of instructionLines) {
        const { tokens, addr, type } = line;
        
        if (!currentSegment || addr !== currentSegment.start + getSegmentSize(currentSegment)) {
            if (currentSegment) segments.push(currentSegment);
            currentSegment = { start: addr, bytes: [] };
        }

        if (type === 'DB') {
            for (let i = 1; i < tokens.length; i++) {
                const val = parseNumber(tokens[i]) || 0;
                currentSegment.bytes.push({ val: val & 0xFF, size: 1 });
            }
            continue;
        }

        const opcode = encodeInstruction(tokens, labels);
        currentSegment.bytes.push({ val: opcode & 0xFFFF, size: 2 });
    }

    if (currentSegment) segments.push(currentSegment);
    return segments;
}

function getReg(token) {
    if (!token || !token.startsWith('V')) return null;
    const hex = token.charAt(1);
    const val = parseInt(hex, 16);
    return isNaN(val) ? null : val;
}

function encodeInstruction(tokens, labels) {
    const instr = tokens[0].toUpperCase();
    const arg1 = tokens[1]?.toUpperCase();
    const arg2 = tokens[2]?.toUpperCase();
    const arg3 = tokens[3]?.toUpperCase();

    const x = getReg(arg1);
    const y = getReg(arg2);
    const n = parseNumber(arg3);
    const nn = parseNumber(arg2);
    const addr = labels[arg1] ?? parseNumber(arg1);

    switch (instr) {
        case 'CLS':
            return 0x00E0;
        case 'RET':
            return 0x00EE;
        case 'JP':
            if (arg2) {
                return 0xB000 | ((labels[arg2] ?? parseNumber(arg2)) & 0x0FFF);
            }
            return 0x1000 | (addr & 0x0FFF);
        case 'CALL':
            return 0x2000 | ((labels[arg1] ?? parseNumber(arg1)) & 0x0FFF);
        case 'SE':
            if (y !== null) return 0x5000 | (x << 8) | (y << 4);
            return 0x3000 | (x << 8) | (nn & 0xFF);
        case 'SNE':
            if (y !== null) return 0x9000 | (x << 8) | (y << 4);
            return 0x4000 | (x << 8) | (nn & 0xFF);
        case 'LD':
            return encodeLD(arg1, arg2, labels);
        case 'ADD':
            if (arg1 === 'I') {
                return 0xF01E | (getReg(arg2) << 8);
            }
            if (y !== null) {
                return 0x8004 | (x << 8) | (y << 4);
            }
            return 0x7000 | (x << 8) | (nn & 0xFF);
        case 'OR':
            return 0x8001 | (x << 8) | (y << 4);
        case 'AND':
            return 0x8002 | (x << 8) | (y << 4);
        case 'XOR':
            return 0x8003 | (x << 8) | (y << 4);
        case 'SUB':
            return 0x8005 | (x << 8) | (y << 4);
        case 'SHR':
            return 0x8006 | (x << 8);
        case 'SUBN':
            return 0x8007 | (x << 8) | (y << 4);
        case 'SHL':
            return 0x800E | (x << 8);
        case 'RND':
            return 0xC000 | (x << 8) | (nn & 0xFF);
        case 'DRW':
            return 0xD000 | (x << 8) | (y << 4) | (parseNumber(arg3) & 0xF);
        case 'PUSH':
            return 0x5000 | (x << 8) | 0x01;
        case 'POP':
            return 0x5000 | (x << 8) | 0x02;
        case 'PUSHA':
            return 0x5000 | 0x03;
        case 'POPA':
            return 0x5000 | 0x04;
        case 'PEAK':
            return 0x5000 | (x << 8) | 0x05;
        case 'SIZESTACK':
            return 0x5000 | (x << 8) | 0x06;
        case 'CLEARSTACK':
            return 0x5000 | 0x07;
        case 'SKP':
            return 0xE09E | (x << 8);
        case 'SKNP':
            return 0xE0A1 | (x << 8);
        default:
            return 0;
    }
}

function encodeLD(arg1, arg2, labels) {
    if (arg1 === 'I') return 0xA000 | ( (labels[arg2] ?? parseNumber(arg2)) & 0x0FFF);
    if (arg1 === 'DT') return 0xF015 | (getReg(arg2) << 8);
    if (arg1 === 'ST') return 0xF018 | (getReg(arg2) << 8);
    if (arg1 === 'F')  return 0xF029 | (getReg(arg2) << 8);
    if (arg1 === 'B')  return 0xF033 | (getReg(arg2) << 8);
    if (arg1 === '[I]') return 0xF055 | (getReg(arg2) << 8);

    const r1 = getReg(arg1);
    if (arg2 === 'DT') return 0xF007 | (r1 << 8);
    if (arg2 === 'K')  return 0xF00A | (r1 << 8);
    if (arg2 === '[I]') return 0xF065 | (r1 << 8);
    
    const r2 = getReg(arg2);
    if (r2 !== null) return 0x8000 | (r1 << 8) | (r2 << 4);
    
    return 0x6000 | (r1 << 8) | (parseNumber(arg2) & 0xFF);
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
        'PUSHA', 'POPA', 'SIZESTACK', 'PEAK', 'CLEARSTACK'
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

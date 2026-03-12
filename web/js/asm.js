const commandTable = {
    'CLS': 0x00E0,
    'RET': 0x00EE,
    'JP': [0x1000, 0xB000],
    'CALL': 0x2000,
    'SE': [0x3000, 0x5000],
    'SNE': [0x4000, 0x9000],
    'LD': [0x6000, 0x8000, 0xA000, 0xF007, 0xF00A, 0xF015, 0xF018, 0xF029, 0xF033, 0xF055, 0xF065],
    'ADD': [0x7000, 0x8004, 0xF01E],
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
    'SKNP': 0xE0A1,
    'V0': [0x0000, 0x0000],
    'V1': [0x0100, 0x0010],
    'V2': [0x0200, 0x0020],
    'V3': [0x0300, 0x0030],
    'V4': [0x0400, 0x0040],
    'V5': [0x0500, 0x0050],
    'V6': [0x0600, 0x0060],
    'V7': [0x0700, 0x0070],
    'V8': [0x0800, 0x0080],
    'V9': [0x0900, 0x0090],
    'VA': [0x0A00, 0x00A0],
    'VB': [0x0B00, 0x00B0],
    'VC': [0x0C00, 0x00C0],
    'VD': [0x0D00, 0x00D0],
    'VE': [0x0E00, 0x00E0],
    'VF': [0x0F00, 0x00F0]
};

// const registersTable = {
//     'V0':  [0x00, 0x000],
//     'V1':  [0x01, 0x001],
//     'V2':  [0x02, 0x002],
//     'V3':  [0x03, 0x003],
//     'V4':  [0x04, 0x004],
//     'V5':  [0x05, 0x005],
//     'V6':  [0x06, 0x006],
//     'V7':  [0x07, 0x007],
//     'V8':  [0x08, 0x008],
//     'V9':  [0x09, 0x009],
//     'VA':  [0x0A, 0x00A],
//     'VB':  [0x0B, 0x00B],
//     'VC':  [0x0C, 0x00C],
//     'VD':  [0x0D, 0x00D],
//     'VE':  [0x0E, 0x00E],
//     'VF':  [0x0F, 0x00F]
// };

let currentAddress = 0x200;
let labels = {};
let ResultBin = [];

export function asmToBin(code) {
    let cleanCode = code.replace(/\s*;[^\n\r]*/g, "").replace(/^\s*[\r\n]/gm, "").trim();
    let cleanCodeArray = cleanCode.replaceAll(",", "").split("\n");
    let codeTokens = [];
    for (let i = 0; i < cleanCodeArray.length; i++) {
        codeTokens.push(cleanCodeArray[i].split(" "));
        if (codeTokens[i][0] == "ORG") {
            currentAddress = codeTokens[i][1];
            // codeTokens.splice(i, 1);
            continue;
        };
        if (codeTokens[i][0].endsWith(":")) {
            labels[codeTokens[i][0].slice(0, -1)] = currentAddress;
            codeTokens[i] = null;
            continue;
        };
        for (let j = 0; j < codeTokens[i].length; j++) {
            if (codeTokens[i][j] in labels) {
                codeTokens[i][j] = labels[codeTokens[i][j]];
                continue;
            }
            if (codeTokens[i][j].startsWith('0x')) {
                continue;
            };
            if (codeTokens[i][j] === 'DB') {
                continue;
            };
            if (codeTokens[i][j] === 'ENDDB') {
                continue;
            };
            if (codeTokens[i][j] === 'F') {
                codeTokens[i].splice(j, 1);
                continue;
            };
            if (codeTokens[i][j] === 'B') {
                codeTokens[i].splice(j, 1);
                continue;
            };
            if (codeTokens[i][j] === 'I') {
                codeTokens[i].splice(j, 1);
                continue;
            };
            if (codeTokens[i][j] === '[I]') {
                codeTokens[i].splice(j, 1);
                continue;
            };
            if (codeTokens[i][j] === 'LD') {
                if (codeTokens[i][j + 1] in commandTable) {
                    if (codeTokens[i][j + 2] in commandTable) {
                        codeTokens[i][j] = commandTable[codeTokens[i][j]][1];
                        continue;
                    } else if (codeTokens[i][j + 2] === 'DT') {
                        codeTokens[i][j] = commandTable[codeTokens[i][j]][3];
                        continue;
                    } else if (codeTokens[i][j + 2] === '[I]') {
                        codeTokens[i][j] = commandTable[codeTokens[i][j]][10];
                        continue;
                    } else if (codeTokens[i][j + 2] === 'K') {
                        codeTokens[i][j] = commandTable[codeTokens[i][j]][4];
                        continue;
                    }
                    else {
                        codeTokens[i][j] = commandTable[codeTokens[i][j]][0];
                        continue;
                    }
                } else if (codeTokens[i][j + 1] === 'I') {
                    codeTokens[i][j] = commandTable[codeTokens[i][j]][2];

                    continue;
                } else if (codeTokens[i][j + 1] === 'DT') {
                    codeTokens[i][j] = commandTable[codeTokens[i][j]][5];

                    continue;
                } else if (codeTokens[i][j + 1] === 'ST') {
                    codeTokens[i][j] = commandTable[codeTokens[i][j]][6];

                    continue;
                } else if (codeTokens[i][j + 1] === 'F') {
                    codeTokens[i][j] = commandTable[codeTokens[i][j]][7];

                    continue;
                } else if (codeTokens[i][j + 1] === 'B') {
                    codeTokens[i][j] = commandTable[codeTokens[i][j]][8];

                    continue;
                } else if (codeTokens[i][j + 1] === '[I]') {
                    codeTokens[i][j] = commandTable[codeTokens[i][j]][9];

                    continue;
                }
            } else if (codeTokens[i][j] === 'ADD') {
                if (codeTokens[i][j + 1] === 'I') {
                    codeTokens[i][j] = commandTable[codeTokens[i][j]][2];

                    continue;
                } else {
                    if (codeTokens[i][j + 2] in commandTable) {
                        codeTokens[i][j] = commandTable[codeTokens[i][j]][1];

                        continue;
                    } else {
                        codeTokens[i][j] = commandTable[codeTokens[i][j]][0];

                        continue;
                    }
                }
            } else if (codeTokens[i][j] === 'JP') {
                if (codeTokens[i][j + 1] in commandTable) {
                    codeTokens[i][j] = commandTable[codeTokens[i][j]][1];

                    continue;
                } else {
                    codeTokens[i][j] = commandTable[codeTokens[i][j]][0];

                    continue;
                }
            } else if (codeTokens[i][j] === 'SE') {
                if (codeTokens[i][j + 2] in commandTable) {
                    codeTokens[i][j] = commandTable[codeTokens[i][j]][0];

                    continue;
                } else {
                    codeTokens[i][j] = commandTable[codeTokens[i][j]][1];

                    continue;
                }
            } else if (codeTokens[i][j] === 'SNE') {
                if (codeTokens[i][j + 2] in commandTable) {
                    codeTokens[i][j] = commandTable[codeTokens[i][j]][0];

                    continue;
                } else {
                    codeTokens[i][j] = commandTable[codeTokens[i][j]][1];

                    continue;
                }
            }
            if (codeTokens[i][j].startsWith('V')) {
                codeTokens[i][j] = commandTable[codeTokens[i][j]][j - 1];

                continue;
            }
            codeTokens[i][j] = commandTable[codeTokens[i][j]];

        }
        currentAddress = parseInt(currentAddress) + 0x002;
    };

    let bin = [];
    let currentSegment = null;
    const tokens = codeTokens.filter(item => item !== null);

    for (let i = 0; i < tokens.length; i++) {
        const row = tokens[i];
        const cmd = row[0];
        const value = row[1];

        if (cmd === 'ORG') {
            if (currentSegment) bin.push(currentSegment);
            currentSegment = {
                start: value,
                binCode: [],
                binData: [],
                mode: 1
            };
            continue;
        }

        if (!currentSegment) continue;

        if (cmd === 'DB') {
            currentSegment.mode = 0;
            Array.isArray(value) ? currentSegment.binData.push(...value) : currentSegment.binData.push(value);
        } else if (cmd === 'ENDDB') {
            currentSegment.mode = 1;
        } else {
            if (currentSegment.mode === 1) {
                let opcode = 0;
                for (let j = 0; j < row.length; j++) {
                    let part = parseInt(row[j]);

                    if (!isNaN(part)) {
                        opcode |= part;
                    }
                }

                currentSegment.binCode.push(opcode & 0xFFFF);
            }
        }
    }

    if (currentSegment) bin.push(currentSegment);

    console.log(codeTokens);
    console.log(labels);
    console.log(bin);

    return bin;
}
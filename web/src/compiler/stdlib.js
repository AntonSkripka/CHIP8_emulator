function arrayParameter(name, { mutable = false, minLength, maxLength } = {}) {
    return {
        name,
        type: 'u8',
        isArray: true,
        mutable,
        minLength,
        maxLength
    };
}

export function createBuiltinModules() {
    const diskFunctions = [
        {
            kind: 'BuiltinFunction',
            name: 'file_size',
            operation: 1,
            resultParameter: 1,
            returnType: 'u8',
            parameters: [
                arrayParameter('filename', { maxLength: 17 }),
                arrayParameter('size_out', { mutable: true, minLength: 4 })
            ]
        },
        {
            kind: 'BuiltinFunction',
            name: 'read_file',
            operation: 2,
            resultParameter: 2,
            returnType: 'u8',
            parameters: [
                arrayParameter('filename', { maxLength: 17 }),
                arrayParameter('buffer', { mutable: true }),
                arrayParameter('bytes_read', { mutable: true, minLength: 4 })
            ]
        },
        {
            kind: 'BuiltinFunction',
            name: 'write_file',
            operation: 3,
            returnType: 'u8',
            parameters: [
                arrayParameter('filename', { maxLength: 17 }),
                arrayParameter('data')
            ]
        },
        {
            kind: 'BuiltinFunction',
            name: 'delete_file',
            operation: 4,
            returnType: 'u8',
            parameters: [arrayParameter('filename', { maxLength: 17 })]
        }
    ];
    return new Map([
        ['disk', new Map(diskFunctions.map((fn) => [fn.name, fn]))]
    ]);
}

export function isBuiltinModule(name) {
    return name === 'disk';
}

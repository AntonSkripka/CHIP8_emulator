export class LanguageError extends Error {
    constructor(code, message, span = { line: 1, column: 1 }) {
        const location = span.fileName
            ? `${span.fileName}:${span.line}:${span.column}`
            : `${span.line}:${span.column}`;
        super(`${code} at ${location}: ${message}`);
        this.name = 'LanguageError';
        this.code = code;
        this.line = span.line;
        this.column = span.column;
        this.span = span;
        if (span.fileName) this.fileName = span.fileName;
    }
}

export function languageError(code, message, tokenOrNode) {
    const span = tokenOrNode?.span ?? tokenOrNode ?? { line: 1, column: 1 };
    return new LanguageError(code, message, span);
}

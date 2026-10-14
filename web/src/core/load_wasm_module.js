export function loadWasmModule({ documentRef, globalObject, scriptUrl }) {
    return new Promise((resolve, reject) => {
        const script = documentRef.createElement('script');
        script.src = scriptUrl;
        script.onload = () => {
            if (typeof globalObject.createChip8 !== 'function') {
                reject(new Error('The CHIP-8 WebAssembly loader did not expose createChip8.'));
                return;
            }
            Promise.resolve()
                .then(() => globalObject.createChip8())
                .then(resolve, reject);
        };
        script.onerror = () => reject(new Error(`Failed to load the CHIP-8 WebAssembly loader from ${scriptUrl}.`));
        documentRef.head.appendChild(script);
    });
}

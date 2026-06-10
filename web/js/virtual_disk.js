export class VirtualDisk {
    constructor(wasmModule) {
        this.wasm = wasmModule;
    }

    _allocateString(str) {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(str);
        const ptr = this.wasm._malloc(bytes.length + 1);
        
        this.wasm.HEAPU8.set(bytes, ptr);
        this.wasm.HEAPU8[ptr + bytes.length] = 0;
        
        return ptr;
    }

    writeFile(filename, fileBytes) {
        let namePtr = 0;
        let dataPtr = 0;

        try {
            namePtr = this._allocateString(filename);
            dataPtr = this.wasm._malloc(fileBytes.length);
            this.wasm.HEAPU8.set(fileBytes, dataPtr);
            const result = this.wasm._vfs_write(namePtr, dataPtr, fileBytes.length);

            if (result === 0) {
                console.log(`Файл ${filename} записан.`);
                return true;
            } else if (result === -1) {
                console.error(`Помилка запису ${filename}: Немає вільного місця на диску.`);
            } else if (result === -2) {
                console.error(`Помилка запису ${filename}: ліміт файлів (макс. 64).`);
            }
            return false;
        } finally {
            if (namePtr) this.wasm._free(namePtr);
            if (dataPtr) this.wasm._free(dataPtr);
        }
    }

    readFile(filename) {
        let namePtr = 0;
        let outBufferPtr = 0;

        try {
            namePtr = this._allocateString(filename);
            const size = this.wasm._vfs_get_file_size(namePtr);
            if (size === 0) {
                console.warn(`Файл ${filename} не знайден на диску.`);
                return null;
            }

            outBufferPtr = this.wasm._malloc(size);
            const result = this.wasm._vfs_read(namePtr, outBufferPtr);
            if (result !== 0) return null;

            const fileData = new Uint8Array(this.wasm.HEAPU8.buffer, outBufferPtr, size);
            return new Uint8Array(fileData);
        } finally {
            if (namePtr) this.wasm._free(namePtr);
            if (outBufferPtr) this.wasm._free(outBufferPtr);
        }
    }

    deleteFile(filename) {
        let namePtr = 0;
        try {
            namePtr = this._allocateString(filename);
            const result = this.wasm._vfs_delete(namePtr);
            return result === 0;
        } catch (err) {
            console.error(`Помилка при видаленні файлу ${filename}:`, err);
            return false;
        } finally {
            if (namePtr) this.wasm._free(namePtr);
        }
    }

    getFilesList() {
        const files = [];
        const maxFiles = this.wasm._fat_get_max_files();

        for (let i = 0; i < maxFiles; i++) {
            const entryPtr = this.wasm._fat_get_directory_entry(i);
            if (entryPtr === 0) continue;

            const isUsed = this.wasm.HEAPU8[entryPtr + 24];

            if (isUsed === 1) {
                const nameBytes = new Uint8Array(this.wasm.HEAPU8.buffer, entryPtr, 18);
                const decoder = new TextEncoder();
                let name = new TextDecoder().decode(nameBytes);
                const nullIdx = name.indexOf('\0');
                if (nullIdx !== -1) name = name.substring(0, nullIdx);
                const size = this.wasm._fat_get_entry_size(i);

                files.push({ name, size });
            }
        }
        return files;
    }

    getDiskSpaceInfo() {
        const total = 1024 * 1024;
        const free = this.wasm._fat_get_free_space_bytes();
        const used = total - free;
        return { total, free, used };
    }
}
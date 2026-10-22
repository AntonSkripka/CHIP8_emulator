const MAX_FILENAME_BYTES = 17;
const DISK_SIZE = 1024 * 1024;
const MAX_FILE_SIZE = DISK_SIZE - (512 + 4096 + 2048) - 2 * 512;

function isValidFilename(filename) {
    return typeof filename === 'string' &&
        filename.length > 0 &&
        filename.length <= MAX_FILENAME_BYTES &&
        !filename.includes('\0') &&
        new TextEncoder().encode(filename).length <= MAX_FILENAME_BYTES;
}

export class VirtualDisk {
    constructor(wasmModule, { logger = console } = {}) {
        this.wasm = wasmModule;
        this.logger = logger;
    }

    _allocateString(str) {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(str);
        const ptr = this.wasm._malloc(bytes.length + 1);

        if (ptr === 0 || ptr + bytes.length + 1 > this.wasm.HEAPU8.length) {
            if (ptr !== 0) this.wasm._free(ptr);
            throw new Error('Could not allocate memory for a virtual-disk filename.');
        }

        try {
            this.wasm.HEAPU8.set(bytes, ptr);
            this.wasm.HEAPU8[ptr + bytes.length] = 0;
        } catch (error) {
            this.wasm._free(ptr);
            throw error;
        }
        return ptr;
    }

    writeFile(filename, fileBytes) {
        let namePtr = 0;
        let dataPtr = 0;

        try {
            if (!isValidFilename(filename)) {
                this.logger.error('Failed to save file: filename must be non-empty, NUL-free, and at most 17 UTF-8 bytes.');
                return false;
            }
            if (!(fileBytes instanceof Uint8Array) || fileBytes.length === 0) {
                this.logger.error('Failed to save file: contents must be a non-empty Uint8Array.');
                return false;
            }
            if (fileBytes.length > MAX_FILE_SIZE) {
                this.logger.error(`Failed to save ${filename}: file exceeds the virtual-disk file-size limit.`);
                return false;
            }

            namePtr = this._allocateString(filename);
            dataPtr = this.wasm._malloc(fileBytes.length);
            if (dataPtr === 0 || dataPtr + fileBytes.length > this.wasm.HEAPU8.length) {
                if (dataPtr !== 0) this.wasm._free(dataPtr);
                dataPtr = 0;
                throw new Error(`Could not allocate memory for ${filename}.`);
            }
            this.wasm.HEAPU8.set(fileBytes, dataPtr);
            const result = this.wasm._vfs_write(namePtr, dataPtr, fileBytes.length);

            if (result === 0) {
                this.logger.log(`File ${filename} saved.`);
                return true;
            } else if (result === -1) {
                this.logger.error(`Failed to save ${filename}: not enough disk space.`);
            } else if (result === -2) {
                this.logger.error(`Failed to save ${filename}: the file limit has been reached (maximum 64 files).`);
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
            if (!isValidFilename(filename)) return null;
            namePtr = this._allocateString(filename);
            const size = this.wasm._vfs_get_file_size(namePtr);
            if (size === 0 || size > MAX_FILE_SIZE) {
                this.logger.warn(`File ${filename} was not found on the disk.`);
                return null;
            }

            outBufferPtr = this.wasm._malloc(size);
            if (outBufferPtr === 0 || outBufferPtr + size > this.wasm.HEAPU8.length) {
                if (outBufferPtr !== 0) this.wasm._free(outBufferPtr);
                outBufferPtr = 0;
                throw new Error(`Could not allocate memory to read ${filename}.`);
            }
            const result = this.wasm._vfs_read(namePtr, outBufferPtr, size);
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
            if (!isValidFilename(filename)) return false;
            namePtr = this._allocateString(filename);
            const result = this.wasm._vfs_delete(namePtr);
            return result === 0;
        } catch (err) {
            this.logger.error(`Failed to delete file ${filename}:`, err);
            return false;
        } finally {
            if (namePtr) this.wasm._free(namePtr);
        }
    }

    getFilesList() {
        const files = [];
        const maxFiles = this.wasm._fat_get_max_files();
        const namePtr = this.wasm._malloc(18);
        if (namePtr === 0 || namePtr + 18 > this.wasm.HEAPU8.length) {
            if (namePtr !== 0) this.wasm._free(namePtr);
            throw new Error('Could not allocate memory to list virtual-disk files.');
        }

        try {
            const decoder = new TextDecoder();
            for (let i = 0; i < maxFiles; i++) {
                const result = this.wasm._fat_get_entry_name(i, namePtr, 18);
                if (result < 0) {
                    throw new Error(`Could not read virtual-disk directory entry ${i}.`);
                }
                if (result === 1) {
                    const nameBytes = this.wasm.HEAPU8.subarray(namePtr, namePtr + 18);
                    const name = decoder.decode(nameBytes).split('\0', 1)[0];
                    const size = this.wasm._fat_get_entry_size(i);
                    if (size > 0 && size <= MAX_FILE_SIZE) files.push({ name, size });
                }
            }
        } finally {
            this.wasm._free(namePtr);
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
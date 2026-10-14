export class StorageBridge {
    constructor({ wasmModule, database, windowRef, documentRef, logger = console, setIntervalRef, clearIntervalRef }) {
        this.wasm = wasmModule;
        this.db = database;
        this.window = windowRef;
        this.document = documentRef;
        this.logger = logger;
        this.setInterval = setIntervalRef;
        this.clearInterval = clearIntervalRef;
        this.diskPtr = null;
        this.DISK_SIZE = 1024 * 1024;
        this.handleBeforeUnload = () => this.syncToDatabase();
        this.handleVisibilityChange = () => {
            if (this.document.visibilityState === 'hidden') this.syncToDatabase();
        };
    }

    async init() {
        this.diskPtr = this.wasm._get_disk_memory_ptr();
        const savedDisk = await this.db.get('disk_image');
        const currentView = new Uint8Array(this.wasm.HEAPU8.buffer, this.diskPtr, this.DISK_SIZE);

        if (savedDisk && savedDisk.byteLength === this.DISK_SIZE) {
            currentView.set(new Uint8Array(savedDisk));
            this.logger.log('Disk restored from IndexedDB.');
        } else {
            currentView.fill(0);
            await this.db.put('disk_image', currentView.slice().buffer);
            this.logger.log('Created a new empty disk in IndexedDB.');
        }

        this.startSyncLoop();
        this.setupEmergencySync();
    }

    startSyncLoop() {
        this.intervalId = this.setInterval(() => {
            this.syncToDatabase();
        }, 3000);
    }

    async syncToDatabase() {
        const isDirty = this.wasm._get_is_dirty();
        
        if (isDirty) {
            this.logger.log('Disk changes detected. Saving...');
            this.wasm._set_is_dirty(false);

            try {
                const currentView = new Uint8Array(this.wasm.HEAPU8.buffer, this.diskPtr, this.DISK_SIZE);
                const diskCopy = currentView.slice().buffer;
                
                await this.db.put('disk_image', diskCopy);
                this.logger.log('Disk synchronized with IndexedDB.');
            } catch (error) {
                this.logger.error('Failed to save the disk to IndexedDB:', error);
                this.wasm._set_is_dirty(true);
            }
        }
    }

    setupEmergencySync() {
        this.window.addEventListener('beforeunload', this.handleBeforeUnload);
        this.document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }

    dispose() {
        this.clearInterval(this.intervalId);
        this.window.removeEventListener('beforeunload', this.handleBeforeUnload);
        this.document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
}
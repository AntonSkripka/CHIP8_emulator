export class StorageBridge {
    constructor(wasmModule, dbInstance) {
        this.wasm = wasmModule;
        this.db = dbInstance;
        this.diskPtr = null;
        this.DISK_SIZE = 1024 * 1024;
    }

    async init() {
        this.diskPtr = this.wasm._get_disk_memory_ptr();
        const savedDisk = await this.db.get('disk_image');
        const currentView = new Uint8Array(this.wasm.HEAPU8.buffer, this.diskPtr, this.DISK_SIZE);

        if (savedDisk && savedDisk.byteLength === this.DISK_SIZE) {
            currentView.set(new Uint8Array(savedDisk));
            console.log("Диск відновлен з IndexedDB");
        } else {
            currentView.fill(0);
            await this.db.put('disk_image', currentView.slice().buffer);
            console.log("Створен новий пустий диск в IndexedDB");
        }

        this.startSyncLoop();
        this.setupEmergencySync();
    }

    startSyncLoop() {
        this.intervalId = setInterval(() => {
            this.syncToDatabase();
        }, 3000);
    }

    async syncToDatabase() {
        const isDirty = this.wasm._get_is_dirty();
        
        if (isDirty) {
            console.log("Знайдені зміни. Збереження...");
            this.wasm._set_is_dirty(false);

            try {
                const currentView = new Uint8Array(this.wasm.HEAPU8.buffer, this.diskPtr, this.DISK_SIZE);
                const diskCopy = currentView.slice().buffer;
                
                await this.db.put('disk_image', diskCopy);
                console.log("Синхронізація з IndexedDB виконана.");
            } catch (error) {
                console.error("Не вдалось зберегти диск у IndexedDB:", error);
                this.wasm._set_is_dirty(true);
            }
        }
    }

    setupEmergencySync() {
        window.addEventListener('beforeunload', () => {
            this.syncToDatabase();
        });
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.syncToDatabase();
            }
        });
    }
}
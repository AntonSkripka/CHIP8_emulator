export class IndexedDbStore {
    constructor(database) {
        this.database = database;
    }

    static open({ indexedDBRef, name = 'Chip8VirtualDiskDB', version = 1 }) {
        return new Promise((resolve, reject) => {
            const request = indexedDBRef.open(name, version);

            request.onupgradeneeded = () => {
                const database = request.result;
                if (!database.objectStoreNames.contains('disk_store')) {
                    database.createObjectStore('disk_store');
                }
            };

            request.onsuccess = () => resolve(new IndexedDbStore(request.result));
            request.onerror = () => reject(request.error);
        });
    }

    get(key) {
        return new Promise((resolve, reject) => {
            const request = this.database
                .transaction('disk_store', 'readonly')
                .objectStore('disk_store')
                .get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    put(key, value) {
        return new Promise((resolve, reject) => {
            const request = this.database
                .transaction('disk_store', 'readwrite')
                .objectStore('disk_store')
                .put(value, key);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}

export class EmulatorBridge {
    constructor({
        disk,
        emulator,
        refreshDisk,
        fetchRef = fetch,
        baseUrl,
        documentRef = document,
        onLaunch = () => {}
    }) {
        this.disk = disk;
        this.emulator = emulator;
        this.refreshDisk = refreshDisk;
        this.fetch = fetchRef;
        this.baseUrl = baseUrl;
        this.document = documentRef;
        this.onLaunch = onLaunch;
    }

    async loadCatalog() {
        const [programsResponse, authorsResponse] = await Promise.all([
            this.fetch(this.assetUrl('programs.json')),
            this.fetch(this.assetUrl('authors.json'))
        ]);
        if (!programsResponse.ok || !authorsResponse.ok) {
            throw new Error('Could not load game catalog metadata.');
        }

        const [programs, authors] = await Promise.all([
            programsResponse.json(),
            authorsResponse.json()
        ]);
        if (!programs || typeof programs !== 'object' || Array.isArray(programs) ||
            !authors || typeof authors !== 'object' || Array.isArray(authors)) {
            throw new TypeError('Game catalog metadata has an invalid format.');
        }
        return { programs, authors };
    }

    async loadGame(slug) {
        const bytes = await this.fetchRom(slug);
        this.emulator.reset();
        this.emulator.loadRom(bytes);
        this.onLaunch();
    }

    async saveGame(slug) {
        const bytes = await this.fetchRom(slug);
        const filename = this.createDiskFilename(slug);
        if (!this.disk.writeFile(filename, bytes)) {
            throw new Error(`Could not save ${filename} to the virtual disk.`);
        }
        this.refreshDisk();
        return filename;
    }

    assetUrl(path) {
        return new URL(path, new URL(this.baseUrl, this.document.baseURI)).toString();
    }

    async fetchRom(slug) {
        const response = await this.fetch(this.assetUrl(`roms/${encodeURIComponent(slug)}.ch8`));
        if (!response.ok) {
            throw new Error(`Could not load ROM "${slug}" (${response.status}).`);
        }
        return new Uint8Array(await response.arrayBuffer());
    }

    createDiskFilename(slug) {
        const existingNames = new Set(this.disk.getFilesList().map(({ name }) => name.toUpperCase()));
        const base = slug.toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 12) || 'GAME';
        const extension = '.CH8';

        for (let suffix = 1; suffix <= 64; suffix += 1) {
            const collisionSuffix = suffix === 1 ? '' : `-${suffix}`;
            const filename = `${base.slice(0, 17 - extension.length - collisionSuffix.length)}${collisionSuffix}${extension}`;
            if (!existingNames.has(filename)) return filename;
        }
        throw new Error('Could not find a free filename for this game on the virtual disk.');
    }
}

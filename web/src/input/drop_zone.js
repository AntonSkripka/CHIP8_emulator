export class DropZoneManager {
    constructor({
        dropZone,
        fileInput,
        statusElement,
        eventTarget,
        onSaveRom,
        onLoadRom,
        onDiskUpdated,
        logger = console
    }) {
        this.dropZone = dropZone;
        this.fileInput = fileInput;
        this.statusElement = statusElement;
        this.eventTarget = eventTarget;
        this.onSaveRom = onSaveRom;
        this.onLoadRom = onLoadRom;
        this.onDiskUpdated = onDiskUpdated;
        this.logger = logger;
        this.maxRomSize = 3584;
        this.handleFileDrop = this.handleFileDrop.bind(this);
        this.handleFileSelect = this.handleFileSelect.bind(this);
        this.setupEventListeners();
    }

    setupEventListeners() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
            this.dropZone.addEventListener(eventName, this.preventDragDefaults);
            this.eventTarget.addEventListener(eventName, this.preventDragDefaults);
        });

        this.dropZone.addEventListener('dragenter', () => this.highlightDropZone());
        this.dropZone.addEventListener('dragover', () => this.highlightDropZone());
        this.dropZone.addEventListener('dragleave', (event) => this.handleDragLeave(event));
        this.dropZone.addEventListener('drop', this.handleFileDrop);
        this.dropZone.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', this.handleFileSelect);
    }

    preventDragDefaults(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    highlightDropZone() {
        this.dropZone.classList.add('dragover');
    }

    handleDragLeave(event) {
        if (event.target === this.dropZone) {
            this.dropZone.classList.remove('dragover');
        }
    }

    handleFileDrop(event) {
        this.dropZone.classList.remove('dragover');
        const [file] = event.dataTransfer?.files ?? [];
        if (file) this.processFile(file);
    }

    handleFileSelect(event) {
        const [file] = event.target.files ?? [];
        if (file) this.processFile(file);
        this.fileInput.value = '';
    }

    async processFile(file) {
        if (!this.isValidRomFile(file.name)) {
            this.showStatus(`✗ Invalid format: ${file.name}`, 'error');
            return;
        }

        if (file.size > this.maxRomSize) {
            this.showStatus(`✗ File too large (${file.size} bytes)`, 'error');
            return;
        }

        if (file.size === 0) {
            this.showStatus('✗ Empty file', 'error');
            return;
        }

        this.showStatus('Loading...', 'loading');

        try {
            const rom = new Uint8Array(await file.arrayBuffer());
            if (!this.onSaveRom(file.name, rom)) {
                this.showStatus('✗ VFS write failed (not enough space?)', 'error');
                return;
            }

            this.onLoadRom(rom);
            this.showStatus(`✓ Saved & loaded: ${file.name}`, 'success');
            this.onDiskUpdated();
        } catch (error) {
            this.logger.error('Error loading ROM:', error);
            this.showStatus('✗ Load failed', 'error');
        }
    }

    isValidRomFile(filename) {
        return filename.toLowerCase().endsWith('.ch8');
    }

    showStatus(message, type = '') {
        this.statusElement.textContent = message;
        this.statusElement.className = type;

        if (type === 'success') {
            setTimeout(() => {
                this.statusElement.textContent = '';
                this.statusElement.className = '';
            }, 2000);
        }
    }
}

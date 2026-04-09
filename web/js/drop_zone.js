export class DropZoneManager {
    constructor(emulator) {
        this.emulator = emulator;
        this.dropZone = document.getElementById('drop-zone');
        this.fileInput = document.getElementById('file-input');
        this.statusElement = document.getElementById('drop-zone-status');
        
        this.MAX_ROM_SIZE = 3584;
        this.ROM_START_ADDR = 0x200;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
            this.dropZone.addEventListener(event, (e) => this.handleDragEvent(e), false);
            document.body.addEventListener(event, (e) => this.handleDragEvent(e), false);
        });

        this.dropZone.addEventListener('dragenter', () => this.highlightDropZone());
        this.dropZone.addEventListener('dragover', () => this.highlightDropZone());
        this.dropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.dropZone.addEventListener('drop', (e) => this.handleFileDrop(e));

        this.dropZone.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
    }

    handleDragEvent(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlightDropZone() {
        this.dropZone.classList.add('dragover');
    }

    handleDragLeave(e) {
        if (e.target === this.dropZone) {
            this.dropZone.classList.remove('dragover');
        }
    }

    handleFileDrop(e) {
        this.dropZone.classList.remove('dragover');
        
        const files = e.dataTransfer?.files || [];
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const files = e.target.files || [];
        if (files.length > 0) {
            this.processFile(files[0]);
        }
        this.fileInput.value = '';
    }

    processFile(file) {
        if (!this.isValidRomFile(file.name)) {
            this.showStatus(`✗ Invalid format: ${file.name}`, 'error');
            return;
        }

        if (file.size > this.MAX_ROM_SIZE) {
            this.showStatus(`✗ File too large (${file.size} bytes)`, 'error');
            return;
        }

        if (file.size === 0) {
            this.showStatus('✗ Empty file', 'error');
            return;
        }

        this.showStatus('Loading...', 'loading');

        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const buffer = event.target.result;
                const uint8Array = new Uint8Array(buffer);

                this.emulator.reset();
                this.emulator.loadch(uint8Array);

                this.showStatus(`✓ Loaded: ${file.name}`, 'success');
            } catch (error) {
                console.error('Error loading ROM:', error);
                this.showStatus('✗ Load failed', 'error');
            }
        };

        reader.onerror = () => {
            this.showStatus('✗ Read error', 'error');
        };

        reader.readAsArrayBuffer(file);
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

export function initializeDropZone(emulator) {
    return new DropZoneManager(emulator);
}

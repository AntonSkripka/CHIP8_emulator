export class DiskUiManager {
    constructor(virtualDisk, emulator, onGameLoadedCallback = null) {
        this.disk = virtualDisk;
        this.emulator = emulator;
        this.onGameLoaded = onGameLoadedCallback;
        this.fileListElement = document.getElementById('file-list');
    }

    refresh() {
        if (!this.fileListElement) return;

        const space = this.disk.getDiskSpaceInfo();
        const header = document.querySelector('#disk-panel .panel-header');
        if (header) {
            header.innerHTML = `
                <span>VIRTUAL DISK</span>
                <span class="disk-stats">Used: ${(space.used / 1024).toFixed(1)} KB / ${(space.total / 1024).toFixed(0)} KB</span>
            `;
        }

        const files = this.disk.getFilesList();
        this.fileListElement.innerHTML = '';

        if (files.length === 0) {
            this.fileListElement.innerHTML = '<li class="empty-disk">Disk is empty</li>';
            return;
        }

        files.forEach(file => {
            const li = document.createElement('li');
            li.className = 'file-item';

            const infoSpan = document.createElement('span');
            infoSpan.className = 'file-info';
            infoSpan.textContent = `${file.name} [${file.size} bytes]`;

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'file-actions';

            const runBtn = document.createElement('button');
            runBtn.className = 'run-file-btn';
            runBtn.textContent = 'RUN';
            runBtn.addEventListener('click', () => this.handleFileAction(file.name));

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-file-btn';
            deleteBtn.textContent = 'DELETE';
            deleteBtn.addEventListener('click', () => {
                if (confirm(`Delete ${file.name} from the virtual disk?`)) {
                    this.disk.deleteFile(file.name);
                    this.refresh();
                }
            });

            actionsDiv.appendChild(runBtn);
            actionsDiv.appendChild(deleteBtn);
            
            li.appendChild(infoSpan);
            li.appendChild(actionsDiv);
            
            this.fileListElement.appendChild(li);
        });
    }

    handleFileAction(filename) {
        const romBytes = this.disk.readFile(filename);
        if (!romBytes || romBytes.length === 0) {
            alert('Could not read the file from the disk.');
            return;
        }

        if (filename.toLowerCase().endsWith('.asm')) {
            const decoder = new TextDecoder();
            const textCode = decoder.decode(romBytes);
            
            const editor = document.getElementById('asm-editor');
            if (editor) {
                editor.value = textCode;
                editor.dispatchEvent(new Event('input')); 
                console.log(`[VFS UI] Source file ${filename} loaded into the editor.`);
            }
        } else {
            this.emulator.reset();
            this.emulator.loadch(romBytes);
            console.log(`[VFS UI] Binary file ${filename} started successfully.`);
            
            if (typeof this.onGameLoaded === 'function') {
                this.onGameLoaded(filename);
            }
        }
    }
}
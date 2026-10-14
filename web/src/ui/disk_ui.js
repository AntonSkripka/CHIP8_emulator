export class DiskUiManager {
    constructor({
        disk,
        documentRef,
        fileListElement,
        diskHeaderElement,
        editor,
        confirmDelete,
        showAlert,
        onLoadSource,
        onRunRom,
        logger = console
    }) {
        this.disk = disk;
        this.document = documentRef;
        this.fileListElement = fileListElement;
        this.diskHeaderElement = diskHeaderElement;
        this.editor = editor;
        this.confirmDelete = confirmDelete;
        this.showAlert = showAlert;
        this.onLoadSource = onLoadSource;
        this.onRunRom = onRunRom;
        this.logger = logger;
    }

    refresh() {
        if (!this.fileListElement) return;

        const space = this.disk.getDiskSpaceInfo();
        if (this.diskHeaderElement) {
            this.diskHeaderElement.innerHTML = `
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
            const li = this.document.createElement('li');
            li.className = 'file-item';

            const infoSpan = this.document.createElement('span');
            infoSpan.className = 'file-info';
            infoSpan.textContent = `${file.name} [${file.size} bytes]`;

            const actionsDiv = this.document.createElement('div');
            actionsDiv.className = 'file-actions';

            const runBtn = this.document.createElement('button');
            runBtn.className = 'run-file-btn';
            runBtn.textContent = 'RUN';
            runBtn.addEventListener('click', () => this.handleFileAction(file.name));

            const deleteBtn = this.document.createElement('button');
            deleteBtn.className = 'delete-file-btn';
            deleteBtn.textContent = 'DELETE';
            deleteBtn.addEventListener('click', () => {
                if (this.confirmDelete(`Delete ${file.name} from the virtual disk?`)) {
                    const wasDeleted = this.disk.deleteFile(file.name);
                    if (!wasDeleted) {
                        this.showAlert(`Could not delete ${file.name} from the virtual disk.`);
                        return;
                    }
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
            this.showAlert('Could not read the file from the disk.');
            return;
        }

        if (filename.toLowerCase().endsWith('.asm')) {
            const decoder = new TextDecoder();
            const textCode = decoder.decode(romBytes);
            if (this.editor) {
                this.onLoadSource(textCode);
                this.logger.log(`[VFS UI] Source file ${filename} loaded into the editor.`);
            }
        } else {
            this.onRunRom(romBytes, filename);
            this.logger.log(`[VFS UI] Binary file ${filename} started successfully.`);
        }
    }
}
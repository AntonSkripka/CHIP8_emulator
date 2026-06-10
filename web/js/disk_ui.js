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
                <span class="disk-stats">Використано: ${(space.used / 1024).toFixed(1)} KB / ${(space.total / 1024).toFixed(0)} KB</span>
            `;
        }

        const files = this.disk.getFilesList();
        this.fileListElement.innerHTML = '';

        if (files.length === 0) {
            this.fileListElement.innerHTML = '<li class="empty-disk">Диск пустий</li>';
            return;
        }

        files.forEach(file => {
            const li = document.createElement('li');
            li.className = 'file-item';

            const infoSpan = document.createElement('span');
            infoSpan.className = 'file-info';
            infoSpan.textContent = `${file.name} [${file.size} байт]`;

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
                if (confirm(`Видалити ${file.name} з віртуального диску?`)) {
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

    /**
     * Обработать действие с файлом в зависимости от его расширения
     */
    handleFileAction(filename) {
        const romBytes = this.disk.readFile(filename);
        if (!romBytes || romBytes.length === 0) {
            alert('Не удалось прочитать файл с диска.');
            return;
        }

        if (filename.toLowerCase().endsWith('.asm')) {
            // ИСХОДНЫЙ КОД: Декодируем байты обратно в текст и вставляем в редактор
            const decoder = new TextDecoder();
            const textCode = decoder.decode(romBytes);
            
            const editor = document.getElementById('asm-editor');
            if (editor) {
                editor.value = textCode;
                // Триггерим событие ввода, чтобы менеджер редактора обновил подсветку синтаксиса и номера строк
                editor.dispatchEvent(new Event('input')); 
                console.log(`[VFS UI] Исходный код ${filename} загружен в редактор.`);
            }
        } else {
            // БИНАРНИК: Сбрасываем и инициализируем процессор CHIP-8
            this.emulator.reset();
            this.emulator.loadch(romBytes);
            console.log(`[VFS UI] Бинарник ${filename} успешно запущен.`);
            
            if (typeof this.onGameLoaded === 'function') {
                this.onGameLoaded(filename);
            }
        }
    }
}
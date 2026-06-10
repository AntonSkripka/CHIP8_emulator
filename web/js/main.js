import { Chip8Emulator } from './index.js';
import { KeyboardInput } from './keyboard.js';
import { EditorManager } from './editor_manager.js';
import { initializeDropZone } from './drop_zone.js';
import { StorageBridge } from './storage.js';
import { VirtualDisk } from './virtual_disk.js';
import { DiskUiManager } from './disk_ui.js';

const initIndexedDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('Chip8VirtualDiskDB', 1);

        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('disk_store')) {
                db.createObjectStore('disk_store');
            }
        };

        request.onsuccess = (e) => {
            const db = e.target.result;
            resolve({
                get: (key) => new Promise((res) => {
                    const tx = db.transaction('disk_store', 'readonly');
                    const req = tx.objectStore('disk_store').get(key);
                    req.onsuccess = () => res(req.result);
                }),
                put: (key, val) => new Promise((res, rej) => {
                    const tx = db.transaction('disk_store', 'readwrite');
                    const req = tx.objectStore('disk_store').put(val, key);
                    req.onsuccess = () => res();
                    req.onerror = () => rej(req.error);
                })
            });
        };
        request.onerror = () => reject(request.error);
    });
};

window.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('app-grid')) return;

    Promise.all([
        createChip8(),
        initIndexedDB()
    ]).then(async ([Module, db]) => {
        const storageBridge = new StorageBridge(Module, db);
        await storageBridge.init();
        Module._vfs_init();
        const disk = new VirtualDisk(Module);
        const canvas = document.getElementById('display');
        const emu = new Chip8Emulator(canvas, Module);
        const diskUi = new DiskUiManager(disk, emu, (filename) => {
            const statusElement = document.getElementById('drop-zone-status');
            if (statusElement) {
                statusElement.textContent = `✓ Active: ${filename}`;
                statusElement.className = 'success';
            }
        });
        const updateDiskUI = () => {
            diskUi.refresh();
        };
        updateDiskUI();
        const keyboard = new KeyboardInput(Module);
        keyboard.attach();

        const editor = document.getElementById('asm-editor');
        const highlightOverlay = document.getElementById('asm-highlight');
        const lineNumbers = document.getElementById('line-numbers');
        const runButton = document.getElementById('run-button');
        const saveButton = document.getElementById('save-button');
        const filenameInput = document.getElementById('asm-filename');

        const editorManager = new EditorManager(editor, highlightOverlay, lineNumbers);
        editorManager.attach();

        if (runButton) {
            runButton.addEventListener('click', () => {
                const code = editor ? editor.value : '';
                emu.runAsm(code);
            });
        }

        if (saveButton && filenameInput) {
            saveButton.addEventListener('click', () => {
                let filename = filenameInput.value.trim();
                const code = editor ? editor.value : '';

                if (!filename) {
                    alert('Введіть назву файлу!');
                    return;
                }

                filename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '');

                if (!filename) {
                    alert(`Некоректне ім'я файлу. Можна використовувати лише латиницю та цифри`);
                    return;
                }

                if (!filename.toLowerCase().endsWith('.asm')) {
                    filename += '.asm';
                }
                
                filenameInput.value = filename;

                if (filename.length > 17) {
                    alert(`Им'я файлу занадто довге (${filename.length} симв.)! Максимум - 17 символів, разом з .asm`);
                    return;
                }

                if (!code) {
                    alert('Редактор пустий!');
                    return;
                }

                const encoder = new TextEncoder();
                const codeBytes = encoder.encode(code);

                const success = disk.writeFile(filename, codeBytes);
                if (success) {
                    updateDiskUI();
                    const statusElement = document.getElementById('drop-zone-status');
                    editor.value = "";
                    
                    if (editorManager && typeof editorManager.updateHighlight === 'function') {
                        editorManager.updateHighlight();
                        editorManager.updateLineNumbers();
                    }

                    if (statusElement) {
                        statusElement.textContent = `✓ Saved ASM: ${filename}`;
                        statusElement.className = 'success';
                        setTimeout(() => { statusElement.textContent = ''; statusElement.className = ''; }, 2000);
                    }
                }
            });
        }

        initializeDropZone(emu, disk, updateDiskUI);

        emu.start();

    }).catch(err => {
        console.error("Критична помилка при запуску CHIP-8 системи:", err);
    });
});
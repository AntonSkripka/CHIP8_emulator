import { Chip8Emulator } from '../core/index.js';
import { KeyboardInput } from '../input/keyboard.js';
import { EditorManager } from '../ui/editor_manager.js';
import { initializeDropZone } from '../input/drop_zone.js';
import { StorageBridge } from '../storage/storage.js';
import { VirtualDisk } from '../storage/virtual_disk.js';
import { DiskUiManager } from '../ui/disk_ui.js';

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

const loadChip8 = () => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `${import.meta.env.BASE_URL}wasm/chip8.js`;
        script.onload = () => {
            if (typeof window.createChip8 !== 'function') {
                reject(new Error('The CHIP-8 WebAssembly loader did not expose createChip8.'));
                return;
            }
            resolve(window.createChip8());
        };
        script.onerror = () => reject(new Error('Failed to load the CHIP-8 WebAssembly loader.'));
        document.head.appendChild(script);
    });
};

window.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('app-grid')) return;

    Promise.all([
        loadChip8(),
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
                    alert('Enter a file name.');
                    return;
                }

                filename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '');

                if (!filename) {
                    alert('Invalid file name. Use only Latin letters, numbers, dots, hyphens, and underscores.');
                    return;
                }

                if (!filename.toLowerCase().endsWith('.asm')) {
                    filename += '.asm';
                }
                
                filenameInput.value = filename;

                if (filename.length > 17) {
                    alert(`The file name is too long (${filename.length} characters). The maximum length is 17 characters, including .asm.`);
                    return;
                }

                if (!code) {
                    alert('The editor is empty.');
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
        console.error('Critical error while starting the CHIP-8 system:', err);
    });
});
import { asmToBin, highlightCode } from '../assembler/asm.js';
import { Chip8Display } from '../core/display.js';
import { Chip8Core } from '../core/emulator_core.js';
import { Chip8Emulator } from '../core/chip8_emulator.js';
import { DEFAULT_PONG_ROM } from '../core/default_rom.js';
import { loadWasmModule } from '../core/load_wasm_module.js';
import { KeyboardInput } from '../input/keyboard.js';
import { DropZoneManager } from '../input/drop_zone.js';
import { IndexedDbStore } from '../storage/indexed_db_store.js';
import { StorageBridge } from '../storage/storage.js';
import { VirtualDisk } from '../storage/virtual_disk.js';
import { DiskUiManager } from '../ui/disk_ui.js';
import { EmulatorMonitor } from '../ui/emulator_monitor.js';
import { EditorManager } from '../ui/editor_manager.js';
import { MemoryMapView } from '../ui/memory_map_view.js';
export async function startApplication({
    documentRef,
    windowRef,
    logger = console,
    confirmDelete = windowRef.confirm.bind(windowRef),
    showAlert = windowRef.alert.bind(windowRef)
}) {
    if (!documentRef.getElementById('app-grid')) return;

    const [module, database] = await Promise.all([
        loadWasmModule({
            documentRef,
            globalObject: windowRef,
            scriptUrl: `${import.meta.env.BASE_URL}wasm/chip8.js`
        }),
        IndexedDbStore.open({ indexedDBRef: windowRef.indexedDB })
    ]);

    const storage = new StorageBridge({
        wasmModule: module,
        database,
        windowRef,
        documentRef,
        logger,
        setIntervalRef: windowRef.setInterval.bind(windowRef),
        clearIntervalRef: windowRef.clearInterval.bind(windowRef)
    });
    await storage.init();
    module._vfs_init();

    const disk = new VirtualDisk(module, { logger });
    if (!disk.getFilesList().some(({ name }) => name.toLowerCase() === 'pong.ch8')) {
        disk.writeFile('PONG.ch8', Uint8Array.from(DEFAULT_PONG_ROM));
    }
    const core = new Chip8Core(module, asmToBin);
    core.init();
    const editor = documentRef.getElementById('asm-editor');
    const status = documentRef.getElementById('asm-status');
    const editorManager = new EditorManager({
        editor,
        highlightOverlay: documentRef.getElementById('asm-highlight'),
        lineNumbers: documentRef.getElementById('line-numbers'),
        highlightCode
    });
    editorManager.attach();
    const display = new Chip8Display({
        canvas: documentRef.getElementById('display'),
        core
    });
    const monitor = new EmulatorMonitor({
        core,
        documentRef,
        debugPanel: documentRef.getElementById('debug-panel'),
        stackContainer: documentRef.getElementById('stack-container')
    });
    const memoryMap = new MemoryMapView({
        core,
        canvas: documentRef.getElementById('memory-map-canvas'),
        infoElement: documentRef.getElementById('mem-info'),
        windowRef
    });
    const emulator = new Chip8Emulator({
        core,
        display,
        monitor,
        memoryMap,
        scheduler: {
            now: () => windowRef.performance.now(),
            requestFrame: (callback) => windowRef.requestAnimationFrame(callback)
        },
        logger,
        moduleResolver: (filename) => disk.readFile(filename),
        onRuntimeFault: ({ fault, pc, source }) => {
            const faultNames = {
                1: 'Stack overflow',
                2: 'Stack underflow',
                3: 'Call stack overflow',
                4: 'Call stack underflow',
                5: 'Division by zero',
                6: 'Stack underflow',
                7: 'Invalid stack frame',
                8: 'Invalid instruction',
                9: 'Memory bounds violation',
                10: 'Write to read-only memory'
            };
            const sourceLocation = source
                ? ` at ${source.fileName ? `${source.fileName}:` : ''}${source.line}:${source.column}`
                : '';
            const activeFilename = documentRef.getElementById('asm-filename')?.value;
            if (source && (!source.fileName || source.fileName === activeFilename)) {
                editorManager.highlightLine(source.line);
            }
            if (status) {
                status.textContent = `Runtime Error: ${faultNames[fault] ??
                    `Unknown fault ${fault}`} at PC=0x${pc.toString(16).toUpperCase().padStart(3, '0')}${sourceLocation}`;
                status.className = 'error';
            }
        },
        onProgramExit: ({ exitCode }) => {
            if (status) {
                status.textContent = exitCode === null
                    ? 'Program finished.'
                    : `Program exited with code ${exitCode}.`;
                status.className = 'success';
            }
        }
    });

    const refreshDisk = () => diskUi.refresh();
    const diskUi = new DiskUiManager({
        disk,
        documentRef,
        fileListElement: documentRef.getElementById('file-list'),
        diskHeaderElement: documentRef.querySelector('#disk-panel .panel-header'),
        editor,
        confirmDelete,
        showAlert,
        logger,
        onLoadSource: (source, filename) => {
            editor.value = source;
            documentRef.getElementById('asm-filename').value = filename;
            editor.dispatchEvent(new windowRef.Event('input'));
        },
        onRunRom: (rom) => {
            emulator.reset();
            emulator.loadRom(rom);
        }
    });
    refreshDisk();

    const keyboard = new KeyboardInput({
        setKey: (key, pressed) => module._set_key(key, pressed),
        eventTarget: windowRef
    });
    keyboard.attach();

    documentRef.getElementById('run-button').addEventListener('click', () => {
        const error = emulator.runAsm(editor?.value ?? '');
        if (status) {
            status.textContent = error ? error.message : 'Compiled and loaded successfully.';
            status.className = error ? 'error' : 'success';
        }
    });

    documentRef.getElementById('compile-language-button').addEventListener('click', () => {
        const error = emulator.runLanguage(editor?.value ?? '', {
            sourceName: documentRef.getElementById('asm-filename')?.value.trim() || undefined
        });
        if (status) {
            status.textContent = error ? error.message : 'CHIP Language compiled and loaded successfully.';
            status.className = error ? 'error' : 'success';
        }
    });

    documentRef.getElementById('save-button').addEventListener('click', () => {
        saveAssembly({
            editor,
            editorManager,
            filenameInput: documentRef.getElementById('asm-filename'),
            statusElement: documentRef.getElementById('drop-zone-status'),
            disk,
            refreshDisk,
            encoder: new TextEncoder(),
            showAlert
        });
    });

    const dropZone = new DropZoneManager({
        dropZone: documentRef.getElementById('drop-zone'),
        fileInput: documentRef.getElementById('file-input'),
        statusElement: documentRef.getElementById('drop-zone-status'),
        eventTarget: documentRef.body,
        onSaveRom: (filename, rom) => disk.writeFile(filename, rom),
        onLoadRom: (rom) => {
            emulator.reset();
            emulator.loadRom(rom);
        },
        onDiskUpdated: refreshDisk,
        logger
    });

    emulator.start();
    return {
        core,
        display,
        emulator,
        disk,
        diskUi,
        editorManager,
        keyboard,
        dropZone,
        storage,
        refreshDisk
    };
}

export function saveAssembly({ editor, editorManager, filenameInput, statusElement, disk, refreshDisk, encoder, showAlert }) {
    let filename = filenameInput.value.trim();
    const source = editor?.value ?? '';

    if (!filename) {
        showAlert('Enter a file name.');
        return;
    }

    filename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '');
    if (!filename) {
        showAlert('Invalid file name. Use only Latin letters, numbers, dots, hyphens, and underscores.');
        return;
    }

    const lowerFilename = filename.toLowerCase();
    const extension = lowerFilename.endsWith('.chip')
        ? '.chip'
        : lowerFilename.endsWith('.asm') ? '.asm' : '.asm';
    if (!lowerFilename.endsWith('.asm') && !lowerFilename.endsWith('.chip')) filename += '.asm';
    filenameInput.value = filename;

    if (filename.length > 17) {
        showAlert(`The file name is too long (${filename.length} characters). The maximum length is 17 characters, including ${extension}.`);
        return;
    }

    if (!source) {
        showAlert('The editor is empty.');
        return;
    }

    if (!disk.writeFile(filename, encoder.encode(source))) return;

    refreshDisk();
    editor.value = '';
    editorManager.updateHighlight();
    editorManager.updateLineNumbers();
    statusElement.textContent = `✓ Saved ${extension === '.chip' ? 'CHIP source' : 'ASM'}: ${filename}`;
    statusElement.className = 'success';
    setTimeout(() => {
        statusElement.textContent = '';
        statusElement.className = '';
    }, 2000);
}

import { asmToBin, highlightCode } from '../assembler/asm.js';
import { Chip8Display } from '../core/display.js';
import { Chip8Core } from '../core/emulator_core.js';
import { Chip8Emulator } from '../core/chip8_emulator.js';
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
    const core = new Chip8Core(module, asmToBin);
    core.init();
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
        logger
    });

    const editor = documentRef.getElementById('asm-editor');
    const editorManager = new EditorManager({
        editor,
        highlightOverlay: documentRef.getElementById('asm-highlight'),
        lineNumbers: documentRef.getElementById('line-numbers'),
        highlightCode
    });
    editorManager.attach();

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
        onLoadSource: (source) => {
            editor.value = source;
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
        emulator.runAsm(editor?.value ?? '');
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
    return { core, display, emulator, disk, diskUi, editorManager, keyboard, dropZone, storage };
}

function saveAssembly({ editor, editorManager, filenameInput, statusElement, disk, refreshDisk, encoder, showAlert }) {
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

    if (!filename.toLowerCase().endsWith('.asm')) filename += '.asm';
    filenameInput.value = filename;

    if (filename.length > 17) {
        showAlert(`The file name is too long (${filename.length} characters). The maximum length is 17 characters, including .asm.`);
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
    statusElement.textContent = `✓ Saved ASM: ${filename}`;
    statusElement.className = 'success';
    setTimeout(() => {
        statusElement.textContent = '';
        statusElement.className = '';
    }, 2000);
}

window.addEventListener('DOMContentLoaded', () => {
    startApplication({
        documentRef: document,
        windowRef: window
    }).catch((error) => {
        console.error('Critical error while starting the CHIP-8 system:', error);
    });
});

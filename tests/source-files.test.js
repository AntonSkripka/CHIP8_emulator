import test from 'node:test';
import assert from 'node:assert/strict';
import { saveAssembly } from '../web/src/app/main.js';
import { DiskUiManager } from '../web/src/ui/disk_ui.js';

test('saves CHIP Language files with the .chip extension', () => {
    let savedFile;
    let refreshed = false;
    const editor = { value: 'fn u8 main() { return 1; }' };
    const statusElement = {};
    const filenameInput = { value: 'module.chip' };

    saveAssembly({
        editor,
        editorManager: { updateHighlight() {}, updateLineNumbers() {} },
        filenameInput,
        statusElement,
        disk: {
            writeFile(filename, bytes) {
                savedFile = { filename, source: new TextDecoder().decode(bytes) };
                return true;
            }
        },
        refreshDisk() { refreshed = true; },
        encoder: new TextEncoder(),
        showAlert(message) { assert.fail(message); }
    });

    assert.deepEqual(savedFile, {
        filename: 'module.chip',
        source: 'fn u8 main() { return 1; }'
    });
    assert.equal(refreshed, true);
    assert.match(statusElement.textContent, /Saved CHIP source: module\.chip/);
});

test('loads .chip files from the virtual disk as source text', () => {
    let loadedSource;
    const source = 'fn u8 main() { return 7; }';
    const manager = new DiskUiManager({
        disk: { readFile: () => new TextEncoder().encode(source) },
        documentRef: {},
        editor: {},
        confirmDelete() {},
        showAlert(message) { assert.fail(message); },
        onLoadSource(text, filename) {
            loadedSource = { text, filename };
        },
        onRunRom() {
            assert.fail('A .chip source file must not be run as a ROM.');
        }
    });

    manager.handleFileAction('module.chip');
    assert.deepEqual(loadedSource, { text: source, filename: 'module.chip' });
});

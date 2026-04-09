import { Chip8Emulator } from './index.js';
import { KeyboardInput } from './keyboard.js';
import { EditorManager } from './editor_manager.js';
import { initializeDropZone } from './drop_zone.js';

window.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('app-grid')) return;

    createChip8().then(Module => {
        const canvas = document.getElementById('display');
        const emu = new Chip8Emulator(canvas, Module);

        const keyboard = new KeyboardInput(Module);
        keyboard.attach();

        const editor = document.getElementById('asm-editor');
        const highlightOverlay = document.getElementById('asm-highlight');
        const lineNumbers = document.getElementById('line-numbers');
        const runButton = document.getElementById('run-button');

        const editorManager = new EditorManager(editor, highlightOverlay, lineNumbers);
        editorManager.attach();

        if (runButton) {
            runButton.addEventListener('click', () => {
                const code = editor ? editor.value : '';
                emu.runAsm(code);
            });
        }

        initializeDropZone(emu);

        emu.start();
    });
});

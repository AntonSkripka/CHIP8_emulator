import { highlightCode } from './asm.js';

export class EditorManager {
    constructor(editor, highlightOverlay, lineNumbers) {
        this.editor = editor;
        this.highlightOverlay = highlightOverlay;
        this.lineNumbers = lineNumbers;
        this.handleInput = this.handleInput.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    attach() {
        if (!this.editor) return;
        this.editor.addEventListener('input', this.handleInput);
        this.editor.addEventListener('scroll', this.handleScroll);
        this.updateLineNumbers();
        this.updateHighlight();
    }

    detach() {
        if (!this.editor) return;
        this.editor.removeEventListener('input', this.handleInput);
        this.editor.removeEventListener('scroll', this.handleScroll);
    }

    handleInput() {
        this.updateLineNumbers();
        this.updateHighlight();
    }

    handleScroll() {
        this.syncHighlightScroll();
    }

    updateLineNumbers() {
        if (!this.lineNumbers || !this.editor) return;
        const lines = this.editor.value.split('\n').length;
        this.lineNumbers.innerHTML = Array.from({ length: lines }, (_, index) => index + 1).join('<br>');
    }

    updateHighlight() {
        if (!this.highlightOverlay || !this.editor) return;
        this.highlightOverlay.innerHTML = highlightCode(this.editor.value);
        this.syncHighlightScroll();
    }

    syncHighlightScroll() {
        if (!this.highlightOverlay || !this.editor) return;
        this.highlightOverlay.scrollTop = this.editor.scrollTop;
        this.highlightOverlay.scrollLeft = this.editor.scrollLeft;
    }

    debugSyncTest() {
        const totalLines = 100;
        const markerLine = 50;
        const content = Array.from({ length: totalLines }, (_, i) => `LD V0, ${i + 1}`).join('\n');

        this.editor.value = content;
        this.updateLineNumbers();
        this.updateHighlight();

        const textScrollHeight = this.editor.scrollHeight;
        const highlightScrollHeight = this.highlightOverlay.scrollHeight;
        const lineNumbersScrollHeight = this.lineNumbers.scrollHeight;

        if (Math.abs(textScrollHeight - highlightScrollHeight) >= 1) {
            console.error('ScrollHeight mismatch: textarea=', textScrollHeight, 'highlight=', highlightScrollHeight);
        }
        if (Math.abs(textScrollHeight - lineNumbersScrollHeight) >= 1) {
            console.error('ScrollHeight mismatch: textarea=', textScrollHeight, 'lineNumbers=', lineNumbersScrollHeight);
        }
        if (Math.abs(highlightScrollHeight - lineNumbersScrollHeight) >= 1) {
            console.error('ScrollHeight mismatch: highlight=', highlightScrollHeight, 'lineNumbers=', lineNumbersScrollHeight);
        }

        this.editor.scrollTop = this.editor.scrollHeight;
        this.syncHighlightScroll();

        if (this.highlightOverlay.scrollTop !== this.editor.scrollTop) {
            console.error('ScrollTop mismatch: highlightOverlay=', this.highlightOverlay.scrollTop, 'textarea=', this.editor.scrollTop);
        }
        if (this.lineNumbers.scrollTop !== this.editor.scrollTop) {
            console.error('ScrollTop mismatch: lineNumbers=', this.lineNumbers.scrollTop, 'textarea=', this.editor.scrollTop);
        }

        const commandWithBlankGroup = () => ['LD V0, 1', ...Array.from({ length: 10 }, () => '')].join('\n');
        this.editor.value = Array.from({ length: 6 }, () => commandWithBlankGroup()).join('\n') + '\n';
        this.updateLineNumbers();
        this.updateHighlight();

        const textScrollHeightEmpty = this.editor.scrollHeight;
        const highlightScrollHeightEmpty = this.highlightOverlay.scrollHeight;
        const lineNumbersScrollHeightEmpty = this.lineNumbers.scrollHeight;

        if (Math.abs(textScrollHeightEmpty - highlightScrollHeightEmpty) >= 1) {
            console.error('Command+empty ScrollHeight mismatch: textarea=', textScrollHeightEmpty, 'highlight=', highlightScrollHeightEmpty);
        }
        if (Math.abs(textScrollHeightEmpty - lineNumbersScrollHeightEmpty) >= 1) {
            console.error('Command+empty ScrollHeight mismatch: textarea=', textScrollHeightEmpty, 'lineNumbers=', lineNumbersScrollHeightEmpty);
        }

        this.editor.scrollTop = this.editor.scrollHeight;
        this.syncHighlightScroll();
        if (this.highlightOverlay.scrollTop !== this.editor.scrollTop) {
            console.error('Command+empty ScrollTop mismatch: highlightOverlay=', this.highlightOverlay.scrollTop, 'textarea=', this.editor.scrollTop);
        }
        if (this.lineNumbers.scrollTop !== this.editor.scrollTop) {
            console.error('Command+empty ScrollTop mismatch: lineNumbers=', this.lineNumbers.scrollTop, 'textarea=', this.editor.scrollTop);
        }

        this.editor.value = Array.from({ length: totalLines }, (_, i) => {
            const line = `LD V0, ${i + 1}`;
            return (i + 1) === markerLine ? `${line} X` : line;
        }).join('\n');
        this.updateLineNumbers();
        this.updateHighlight();

        this.highlightOverlay.innerHTML = this.highlightOverlay.innerHTML.replace(' X', ' <span class="debug-marker">X</span>');

        const marker = this.highlightOverlay.querySelector('.debug-marker');
        if (!marker) {
            console.error('Debug marker not found in highlight overlay');
            return;
        }

        const editorRect = this.editor.getBoundingClientRect();
        const markerRect = marker.getBoundingClientRect();
        const expectedTop = editorRect.top + 10 + (markerLine - 1) * 20 - this.editor.scrollTop;
        if (Math.abs(markerRect.top - expectedTop) >= 2) {
            console.error('Marker alignment mismatch:', markerRect.top, expectedTop);
        } else {
            console.log('debugSyncTest passed');
        }
    }
}

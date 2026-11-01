export class EditorManager {
    constructor({ editor, highlightOverlay, lineNumbers, highlightCode }) {
        this.editor = editor;
        this.highlightOverlay = highlightOverlay;
        this.lineNumbers = lineNumbers;
        this.highlightCode = highlightCode;
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
        const lineCount = this.editor.value.split('\n').length;
        this.lineNumbers.innerHTML = `<div class="line-number-content">${Array.from(
            { length: lineCount },
            (_, index) => index + 1
        ).join('<br>')}</div>`;
        this.lineNumberContent = this.lineNumbers.firstElementChild;
        this.syncHighlightScroll();
    }

    updateHighlight() {
        if (!this.highlightOverlay || !this.editor) return;
        this.highlightOverlay.innerHTML = this.highlightCode(this.editor.value);
        this.syncHighlightScroll();
    }

    highlightLine(line) {
        if (!this.editor || !Number.isInteger(line) || line < 1) return false;
        const lines = this.editor.value.split('\n');
        if (line > lines.length) return false;

        const start = lines.slice(0, line - 1).reduce((offset, value) =>
            offset + value.length + 1, 0);
        this.editor.focus();
        this.editor.setSelectionRange(start, start + lines[line - 1].length);
        return true;
    }

    syncHighlightScroll() {
        if (!this.highlightOverlay || !this.editor) return;
        this.highlightOverlay.scrollTop = this.editor.scrollTop;
        this.highlightOverlay.scrollLeft = this.editor.scrollLeft;
        if (this.lineNumberContent) {
            this.lineNumberContent.style.transform = `translateY(-${this.editor.scrollTop}px)`;
        }
    }
}

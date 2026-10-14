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
        this.lineNumbers.innerHTML = Array.from({ length: lineCount }, (_, index) => index + 1).join('<br>');
    }

    updateHighlight() {
        if (!this.highlightOverlay || !this.editor) return;
        this.highlightOverlay.innerHTML = this.highlightCode(this.editor.value);
        this.syncHighlightScroll();
    }

    syncHighlightScroll() {
        if (!this.highlightOverlay || !this.editor) return;
        this.highlightOverlay.scrollTop = this.editor.scrollTop;
        this.highlightOverlay.scrollLeft = this.editor.scrollLeft;
    }
}

export class EmulatorMonitor {
    constructor({ core, documentRef, debugPanel, stackContainer }) {
        this.core = core;
        this.document = documentRef;
        this.stackContainer = stackContainer;
        this.regElements = [];
        this.lastStackSize = -1;
        this.lastStackStart = -1;
        this.createDebugUI(debugPanel);
    }

    updateDebug() {
        const registers = this.core.getVRegistersView();
        if (!registers) return;

        registers.forEach((register, index) => {
            const value = register.toString(16).toUpperCase().padStart(2, '0');
            if (this.regElements[index].textContent !== value) {
                this.regElements[index].textContent = value;
            }
        });

        this.pcElement.textContent = `0x${this.core.getPC().toString(16).toUpperCase().padStart(3, '0')}`;
        this.iElement.textContent = `0x${this.core.getI().toString(16).toUpperCase().padStart(3, '0')}`;
        this.spElement.textContent = `0x${this.core.getCallStackPtr().toString(16).toUpperCase().padStart(2, '0')}`;
        this.spdElement.textContent = this.core.getSpd();
    }

    updateStackUI() {
        if (!this.stackContainer || !this.core.hasStackSupport()) return;

        const stackSize = this.core.getSpd();
        const startIndex = Math.max(0, stackSize - 64);
        if (this.lastStackSize === stackSize && this.lastStackStart === startIndex) return;

        this.stackContainer.replaceChildren();
        for (let index = stackSize - 1; index >= startIndex; index--) {
            const cell = this.document.createElement('div');
            const value = this.core.getStackValue(index);
            cell.className = 'stack-cell';
            cell.textContent = `#${index.toString().padStart(4, '0')}: 0x${value.toString(16).toUpperCase().padStart(2, '0')}`;
            this.stackContainer.appendChild(cell);
        }

        this.lastStackSize = stackSize;
        this.lastStackStart = startIndex;
    }

    reset() {
        this.lastStackSize = -1;
        this.lastStackStart = -1;
        this.updateStackUI();
    }

    createDebugUI(debugPanel) {
        const container = this.document.createElement('div');
        container.classList.add('debug-container');

        for (let index = 0; index < 16; index++) {
            const register = this.document.createElement('div');
            register.innerHTML = `V${index.toString(16).toUpperCase()}: <span>00</span>`;
            container.appendChild(register);
            this.regElements.push(register.querySelector('span'));
        }

        this.pcElement = this.appendValueRow(container, 'PC', '0x000', 'pc-row');
        this.iElement = this.appendValueRow(container, 'I', '0x000');
        this.spElement = this.appendValueRow(container, 'SP', '0x00');
        this.spdElement = this.appendValueRow(container, 'SPD', '0');
        (debugPanel ?? this.document.body).appendChild(container);
    }

    appendValueRow(container, label, initialValue, className = '') {
        const row = this.document.createElement('div');
        if (className) row.classList.add(className);
        row.innerHTML = `${label}: <span>${initialValue}</span>`;
        container.appendChild(row);
        return row.querySelector('span');
    }
}

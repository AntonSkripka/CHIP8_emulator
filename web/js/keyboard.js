export const KEY_MAP = {
    'Digit1': 0x1, 'Digit2': 0x2, 'Digit3': 0x3, 'Digit4': 0xC,
    'KeyQ': 0x4, 'KeyW': 0x5, 'KeyE': 0x6, 'KeyR': 0xD,
    'KeyA': 0x7, 'KeyS': 0x8, 'KeyD': 0x9, 'KeyF': 0xE,
    'KeyZ': 0xA, 'KeyX': 0x0, 'KeyC': 0xB, 'KeyV': 0xF
};

export class KeyboardInput {
    constructor(module) {
        this.module = module;
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    attach() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    detach() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }

    handleKeyDown(event) {
        const keyIndex = KEY_MAP[event.code];
        if (keyIndex !== undefined) {
            this.module._set_key(keyIndex, 1);
        }
    }

    handleKeyUp(event) {
        const keyIndex = KEY_MAP[event.code];
        if (keyIndex !== undefined) {
            this.module._set_key(keyIndex, 0);
        }
    }
}

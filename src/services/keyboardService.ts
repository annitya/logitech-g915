import { GlobalKeyboardListener, IGlobalKeyListener } from 'node-global-key-listener';

class KeyboardService {
    keyboardListener: GlobalKeyboardListener;

    constructor() {
        this.keyboardListener = new GlobalKeyboardListener();
    }

    addListener(listener: IGlobalKeyListener) {
        this.keyboardListener.addListener(listener);
    }
}

const keyboardListener = new KeyboardService();

export default keyboardListener;

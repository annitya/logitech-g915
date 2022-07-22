import { GlobalKeyboardListener } from 'node-global-key-listener';
import Denon from './Denon.mjs';
import { initLogiled, blackenKeys, highlightKeys} from "./services/lightService.mjs";
import ClockService from "./services/clockService.mjs";

const VOLUME_UP = 'VOLUME_UP';
const VOLUME_DOWN = 'VOLUME_DOWN';
const F24 = 'F24';

let running = false;

const start = () => running = true;
const stop = () => running = false;

const getNumberParts = (denonVolume) => {
    const denonString = denonVolume.toString();
    let number;

    if (denonString.length === 5) {
        number = denonString.substring(2, 4);
    } else {
        number = denonString.substring(2, 5) / 10;
    }

    number = (80 - number).toString();

    const first = number.substring(0, 1);
    let second = number.substring(1, 2);
    const hasThird = number.length === 4;
    // Round up.
    if (hasThird) {
        second = (+second + 1).toString();
    }

    return [first, second, hasThird];
}

const onData = (denonVolume) => {
    stop();

    if (denonVolume.includes('MAX')) {
        return;
    }

    const [first, second, hasThird] = getNumberParts(denonVolume);

    blackenKeys(first, second);
    highlightKeys(first, second, hasThird);
}

const keyboardListener = new GlobalKeyboardListener();
const denon = new Denon(onData);

if (process.env.NODE_ENV === 'DEBUG') {
    denon.logData();
}

const runCommand = (command) => {
    if (running) {
        return true;
    }

    start();
    denon.command(command);

    return true;
}

const handleScrollWheel = (e) => {
    const { rawKey } = e;
    const { name } = rawKey;

    switch (name) {
        case VOLUME_UP:
            return runCommand('MVUP');
        case VOLUME_DOWN:
            return runCommand('MVDOWN');
        case F24:
            return runCommand('MV42')
    }

    return [VOLUME_UP, VOLUME_DOWN, F24].includes(name);
}

const clockService = new ClockService();

denon.connect().then(() => {
    denon.command('MV?');
    initLogiled();
    clockService.start();
    keyboardListener.addListener(handleScrollWheel);
});

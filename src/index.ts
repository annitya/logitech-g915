import { GlobalKeyboardListener, IGlobalKeyEvent } from 'node-global-key-listener';
import Denon from './Denon';
import { initLogiled, blackenKeys, highlightKeys} from './services/lightService';
import ClockService from "./services/clockService";

const VOLUME_UP = 'VOLUME_UP';
const VOLUME_DOWN = 'VOLUME_DOWN';
const F24 = 'F24';

let running = false;

const start = () => running = true;
const stop = () => running = false;

const getNumberParts = (denonVolume: Buffer): [number, number, boolean] => {
    const denonString = denonVolume.toString();
    let volume: number;

    if (denonString.length === 5) {
        volume = +denonString.substring(2, 4);
    } else {
        volume = +denonString.substring(2, 5) / 10;
    }

    const volumeString = (80 - volume).toString();

    const first = volumeString.substring(0, 1);
    let second = volumeString.substring(1, 2);
    const hasThird = volumeString.length === 4;
    // Round up.
    if (hasThird) {
        second = (+second + 1).toString();
    }

    return [+first, +second, hasThird];
}

const onData = (denonVolume: Buffer) => {
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

const runCommand = (command: string) => {
    if (running) {
        return true;
    }

    start();
    denon.command(command);

    return true;
}

const handleScrollWheel = (e: IGlobalKeyEvent) => {
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
    console.log('ok');
});

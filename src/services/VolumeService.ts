import Denon from '../Denon';
import NumericDisplay from "./NumericDisplay";
import logiled from "logiled";
import { GlobalKeyboardListener, IGlobalKeyEvent } from 'node-global-key-listener';

const VOLUME_UP = 'VOLUME_UP';
const VOLUME_DOWN = 'VOLUME_DOWN';
const F24 = 'F24';

const keyMap = [
    logiled.KeyName.NUM_ZERO,
    logiled.KeyName.NUM_ONE,
    logiled.KeyName.NUM_TWO,
    logiled.KeyName.NUM_THREE,
    logiled.KeyName.NUM_FOUR,
    logiled.KeyName.NUM_FIVE,
    logiled.KeyName.NUM_SIX,
    logiled.KeyName.NUM_SEVEN,
    logiled.KeyName.NUM_EIGHT,
    logiled.KeyName.NUM_NINE
];

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

export default class VolumeService {
    running: boolean = false;
    denon: Denon;
    volumeDisplay: NumericDisplay;
    keyboardListener: GlobalKeyboardListener;

    constructor() {
        this.denon = new Denon(this.onData);
        this.volumeDisplay = new NumericDisplay(keyMap);

        if (process.env.NODE_ENV === 'DEBUG') {
            this.denon.logData();
        }

        this.keyboardListener = new GlobalKeyboardListener();
        this.keyboardListener.addListener(this.handleScrollWheel);
    }

    async init() {
        return this.denon.connect().then(() => this.runCommand('MV?'));
    }

    start() {
        this.running = true;
    }

    stop() {
        this.running = false;
    }

    runCommand = (command: string) => {
        if (this.running) {
            return true;
        }

        this.start();
        this.denon.command(command);

        return true;
    }

    onData = (denonVolume: Buffer) => {
        this.stop();

        if (denonVolume.includes('MAX')) {
            return;
        }

        const [first, second, hasThird] = getNumberParts(denonVolume);
        this.volumeDisplay.highlightKeys(first, second, hasThird);
    }

    handleScrollWheel = (e: IGlobalKeyEvent) => {
        const {rawKey} = e;
        const {name} = rawKey;

        switch (name) {
            case VOLUME_UP:
                return this.runCommand('MVUP');
            case VOLUME_DOWN:
                return this.runCommand('MVDOWN');
            case F24:
                return this.runCommand('MV42')
        }

        return [VOLUME_UP, VOLUME_DOWN, F24].includes(name);
    }
}
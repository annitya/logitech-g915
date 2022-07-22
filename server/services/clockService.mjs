import faultyImport from 'logiled';
import {blackenKey, blueWithKey, redWithKey} from "./lightService.mjs";
const logiled = faultyImport.default;

const hourKeyMap = [
    logiled.KeyName.F12,
    logiled.KeyName.F1,
    logiled.KeyName.F2,
    logiled.KeyName.F3,
    logiled.KeyName.F4,
    logiled.KeyName.F5,
    logiled.KeyName.F6,
    logiled.KeyName.F7,
    logiled.KeyName.F8,
    logiled.KeyName.F9,
    logiled.KeyName.F10,
    logiled.KeyName.F11,
]

const minuteKeyMap = [
    logiled.KeyName.ZERO,
    logiled.KeyName.ONE,
    logiled.KeyName.TWO,
    logiled.KeyName.THREE,
    logiled.KeyName.FOUR,
    logiled.KeyName.FIVE,
    logiled.KeyName.SIX,
    logiled.KeyName.SEVEN,
    logiled.KeyName.EIGHT,
    logiled.KeyName.NINE
];

export default class ClockService {
    start() {
        const now = new Date();
        let hours = now.toLocaleString('en-US', { hour: 'numeric', hour12: true }).replace(' PM', '').replace(' AM', '');
        const minutes = now.getMinutes();

        if (+hours === 12) {
            hours = 0;
        }

        this.setHours(hours);
        this.setMinutes(minutes);

        setTimeout(() => this.start(), 1000 * 59);
    }

    setHours(hours) {
        const restoreKeys = hourKeyMap.filter((value, key) => key !== +hours);
        restoreKeys.forEach(blackenKey);

        const highlightKey = hourKeyMap[hours];
        redWithKey(highlightKey);
    }

    setMinutes(minutes) {
        const [first, second] = minutes.toString().split('');
        const firstKey = minuteKeyMap[first];
        const secondKey = second ? minuteKeyMap[second] : false;

        const restoreKeys = minuteKeyMap.filter((value, key) => {
            if (!secondKey) {
                return key !== +first;
            }

            return ![+first, +second].includes(key);
        });

        restoreKeys.forEach(blackenKey);

        if (first === second) {
            logiled.setLightingForKeyWithKeyName(blueWithKey(firstKey, 100));
        } else {
            logiled.setLightingForKeyWithKeyName(redWithKey(firstKey));

            if (secondKey) {
                logiled.setLightingForKeyWithKeyName(redWithKey(secondKey));
            }
        }
    }
}
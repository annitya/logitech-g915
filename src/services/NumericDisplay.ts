import { LogiLedSetLightingForKeyWithScanCode } from 'logitech-led';
import { KeyName } from '../KeyName';

export default class NumericDisplay {
    keyMap: KeyName[];

    constructor(keyMap: KeyName[]) {
        this.keyMap = keyMap;
    }

    highlightKeys(first: number, second?: number, hasThird = false) {
        const firstKey = this.keyMap[first];

        const colorPercentage = hasThird ? 50 : 100;
        // Only one key to display both values.
        if (first === second) {
            this.blueKey(firstKey, colorPercentage);
            return
        }

        this.redKey(firstKey);

        if (second) {
            const secondKey = this.keyMap[second];
            this.blackenKeys(first, second);
            this.greenKey(secondKey, colorPercentage);
        }
    }

    blackenKeys(first: number, second: number) {
        const excludeKeys = [
            this.keyMap[first],
            this.keyMap[second]
        ];

        const restoreKeys = this.keyMap.filter(key => !excludeKeys.includes(key));
        restoreKeys.forEach(this.blackKey);
    }

    blackKey = (keyName: KeyName) => LogiLedSetLightingForKeyWithScanCode(
        keyName,
        0,
        0,
        0
    );

    blueKey = (keyName: KeyName, bluePercentage: number) => LogiLedSetLightingForKeyWithScanCode(
        keyName,
        0,
        0,
        bluePercentage
    );

    redKey = (keyName: KeyName) => LogiLedSetLightingForKeyWithScanCode(
        keyName,
        100,
        0,
        0
    );

    greenKey = (keyName: KeyName, greenPercentage: number) => LogiLedSetLightingForKeyWithScanCode(
        keyName,
        0,
        greenPercentage,
        0
    );
}

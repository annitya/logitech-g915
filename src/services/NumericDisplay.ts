import logiled from 'logiled';
import { KeyName } from "logiled/dist/keyname";

export const initLogiled = () => {
    logiled.init();
    logiled.saveCurrentLighting();
}

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

    blackKey = (keyName: KeyName) => logiled.setLightingForKeyWithKeyName({
        keyName,
        redPercentage: 0,
        greenPercentage: 0,
        bluePercentage: 0
    });

    blueKey = (keyName: KeyName, bluePercentage: number) => logiled.setLightingForKeyWithKeyName({
        keyName,
        redPercentage: 0,
        greenPercentage: 0,
        bluePercentage
    });

    redKey = (keyName: KeyName) => logiled.setLightingForKeyWithKeyName({
        keyName,
        redPercentage: 100,
        greenPercentage: 0,
        bluePercentage: 0
    });

    greenKey = (keyName: KeyName, greenPercentage: number) => logiled.setLightingForKeyWithKeyName({
        keyName,
        redPercentage: 0,
        greenPercentage,
        bluePercentage: 0
    });
}

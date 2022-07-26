import logiled from 'logiled';
import { KeyName } from "logiled/dist/keyname";

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

export const initLogiled = () => {
    logiled.init();
    logiled.saveCurrentLighting();
}

export const blackenKey = (keyName: KeyName) => logiled.setLightingForKeyWithKeyName({
    keyName,
    redPercentage: 0,
    greenPercentage: 0,
    bluePercentage: 0
})

export const blackenKeys = (first: number, second: number) => {
    const excludeKeys = [
        keyMap[first],
        keyMap[second]
    ];

    const restoreKeys = keyMap.filter(key => !excludeKeys.includes(key));
    restoreKeys.forEach(blackenKey);
}

export const blueWithKey = (keyName: KeyName, bluePercentage: number) => ({
    keyName,
    redPercentage: 0,
    greenPercentage: 0,
    bluePercentage
});

export const redWithKey = (keyName: KeyName) => ({
    keyName,
    redPercentage: 100,
    greenPercentage: 0,
    bluePercentage: 0
})

export const greenWithKey = (keyName: KeyName, greenPercentage: number) => ({
    keyName,
    redPercentage: 0,
    greenPercentage,
    bluePercentage: 0
})

export const highlightKeys = (first: number, second: number, hasThird: boolean) => {
    const firstKey = keyMap[first];
    const secondKey = keyMap[second];

    const colorPercentage = hasThird ? 50 : 100;
    // Only one key to display both values.
    if (first === second) {
        logiled.setLightingForKeyWithKeyName(blueWithKey(firstKey, colorPercentage));
    } else {
        logiled.setLightingForKeyWithKeyName(redWithKey(firstKey));
        logiled.setLightingForKeyWithKeyName(greenWithKey(secondKey, colorPercentage));
    }
}

import faultyImport from 'logiled';
const logiled = faultyImport.default;

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

export const blackenKeys = (first, second) => {
    const excludeKeys = [
        keyMap[first],
        keyMap[second]
    ];

    const restoreKeys = keyMap.filter(key => !excludeKeys.includes(key));

    restoreKeys.forEach(keyName => logiled.setLightingForKeyWithKeyName({
        keyName,
        redPercentage: 0,
        greenPercentage: 0,
        bluePercentage: 0
    }));
}

const blueWithKey = (keyName, bluePercentage) => ({
    keyName,
    redPercentage: 0,
    greenPercentage: 0,
    bluePercentage
});

const redWithKey = (keyName) => ({
    keyName,
    redPercentage: 100,
    greenPercentage: 0,
    bluePercentage: 0
})

const greenWithKey = (keyName, greenPercentage) => ({
    keyName,
    redPercentage: 0,
    greenPercentage,
    bluePercentage: 0
})

export const highlightKeys = (first, second, hasThird) => {
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

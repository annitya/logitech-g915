import logiled from 'logiled';
import NumericDisplay from './NumericDisplay';

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
    hourDisplay: NumericDisplay;
    minuteDisplay: NumericDisplay;

    constructor() {
        this.hourDisplay = new NumericDisplay(hourKeyMap);
        this.minuteDisplay = new NumericDisplay(minuteKeyMap);
    }

    continouslyUpdate = () => {
        const now = new Date();
        const [firstHourDigit, secondHourDigit] = now.getHours().toString().split('');
        const [firstMinuteDigit, secondMinuteDigit] = now.getMinutes().toString().split('');

        this.hourDisplay.highlightKeys(+firstHourDigit, +secondHourDigit)
        this.minuteDisplay.highlightKeys(+firstMinuteDigit, +secondMinuteDigit)

        setTimeout(this.continouslyUpdate, 1000 * 15);
    }
}

import NumericDisplay from './NumericDisplay';
import { KeyName } from '../KeyName';

const hourKeyMap = [
    KeyName.F12,
    KeyName.F1,
    KeyName.F2,
    KeyName.F3,
    KeyName.F4,
    KeyName.F5,
    KeyName.F6,
    KeyName.F7,
    KeyName.F8,
    KeyName.F9,
    KeyName.F10,
    KeyName.F11,
]

const minuteKeyMap = [
    KeyName.ZERO,
    KeyName.ONE,
    KeyName.TWO,
    KeyName.THREE,
    KeyName.FOUR,
    KeyName.FIVE,
    KeyName.SIX,
    KeyName.SEVEN,
    KeyName.EIGHT,
    KeyName.NINE
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

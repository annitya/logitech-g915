import { initLogiled } from './services/NumericDisplay';
import VolumeService from './services/VolumeService';
import ClockService from './services/ClockService';

const volumeService = new VolumeService();
const clockService = new ClockService();

volumeService.init().then(() => {
    initLogiled();
    clockService.continouslyUpdate();
})

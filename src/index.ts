import { LogiLedInit, LogiLedSaveCurrentLighting } from 'logitech-led';
import VolumeService from './services/VolumeService';

const volumeService = new VolumeService();

volumeService.init().then(() => {
    const result = LogiLedInit();

    if (!result) {
        console.error('Failed to init.');
        process.exit(1);
    }

    LogiLedSaveCurrentLighting();
    // clockService.continouslyUpdate();
})

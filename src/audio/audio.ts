import { ipcRenderer } from 'electron';
import { AudioManager } from './AudioManager';
import { AppIpcAudio } from './AppIpcAudio';
import { EAppIpcAction } from '../shared/AppIpc/EAppIpcAction';

let appIpcAudio = new AppIpcAudio();
let audioManager = new AudioManager(appIpcAudio);

globalThis.appIpcAudio = appIpcAudio;
globalThis.audioManager = audioManager;

function audioUpdateCallback(request: string, data: any) {
    appIpcAudio[request] = data;
}

appIpcAudio.on("Commands", EAppIpcAction.Update, audioUpdateCallback);
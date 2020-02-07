import { ipcRenderer } from 'electron';
import { AudioManager } from './AudioManager';
import { AppIpcAudio } from './AppIpcAudio';
import { EAppIpcAction } from '../shared/AppIpc/EAppIpcAction';
import { IpcRequest } from '../shared/AppIpc/IpcRequest';

let appIpcAudio = new AppIpcAudio();
let audioManager = new AudioManager(appIpcAudio);

globalThis.appIpcAudio = appIpcAudio;
globalThis.audioManager = audioManager;

function audioQueryCallback(request: string, data: any) {
    appIpcAudio.send2Index(EAppIpcAction.Response, [
        new IpcRequest(request, audioManager[request])
    ]);
}

function audioUpdateCallback(request: string, data: any) {
    console.log(`audioRecieve update: ${request}, ${data}`);
    audioManager[request] = data;
}

appIpcAudio.on("Commands", EAppIpcAction.Update, audioUpdateCallback);
appIpcAudio.on("Index", EAppIpcAction.Update, audioUpdateCallback);
appIpcAudio.on("Index", EAppIpcAction.Query, audioQueryCallback);
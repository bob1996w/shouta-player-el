export = 0;
import  { ipcRenderer, remote } from 'electron';
import { Howl, Holwer } from 'howler';
import { AppIpcMessage } from '../shared/AppIpc/AppIpcMessage';
import { EAppIpcAction } from '../shared/AppIpc/EAppIpcAction';
import { AudioData } from '../shared/Data/AudioData';

class AudioManager {
    private howl: Howl = null;
    private currentAudioData: AudioData = null;

    public constructor() {
        console.log("AudioManager initialized.");
    }

    public setAndPlay(audioData: AudioData) {
        let self = this;
        this.currentAudioData = audioData;
        this.howl = new Howl({
            src: [audioData.url],
            volume: 0.5,
            onloaderror: (id, error) => { console.log(`Howler error #${id}: ${error}`); }
        });
        this.howl.once('load', function(){
            self.howl.play();
        });
    }
}

let audioManager = new AudioManager();

ipcRenderer.on("FromWebSocket", (ev, msg: AppIpcMessage) => {
    console.log(`getMessage FromWebSocket`);
    console.log(msg);
    if (msg.receiverModule !== "Audio") return;
    if (msg.action === EAppIpcAction.Update && msg.request === "Play") {
        audioManager.setAndPlay(msg.data.AudioData);
    }
})


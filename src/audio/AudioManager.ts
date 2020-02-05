import { Howl, Holwer } from 'howler';
import { AppIpcAudio } from './AppIpcAudio';
import { AppIpcMessage } from '../shared/AppIpc/AppIpcMessage';
import { EAppIpcAction } from '../shared/AppIpc/EAppIpcAction';
import { AudioData } from '../shared/Data/AudioData';

export class AudioManager {
    private appIpcAudio: AppIpcAudio = null;
    private howl: Howl = null;
    private currentAudioData: AudioData = null;

    public constructor(appIpcAudio: AppIpcAudio) {
        this.appIpcAudio = appIpcAudio;
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


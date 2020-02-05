import { Howl, Holwer } from 'howler';
import { AppIpcAudio } from './AppIpcAudio';
import { AppIpcMessage } from '../shared/AppIpc/AppIpcMessage';
import { EAppIpcAction } from '../shared/AppIpc/EAppIpcAction';
import { AudioData } from '../shared/Data/AudioData';
import { EAudioPlaybackState } from '../shared/Audio/EAudioPlaybackState';

export class AudioManager {
    private appIpcAudio: AppIpcAudio = null;

    private _howl: Howl = null;

    private _volume: number = 0.5;    // the volume should be 0 ~ 1.
    private _currentPlaylistIndex: number = null;
    private _currentPlaylist: AudioData[] = null;

    public constructor(appIpcAudio: AppIpcAudio) {
        this.appIpcAudio = appIpcAudio;
        this._currentPlaylist = [];
        console.log("AudioManager initialized.");
    }

    public get currentPlaylist(): AudioData[] {
        return this._currentPlaylist;
    }

    public set currentPlaylist(value: AudioData[]) {
        if (value.length === 0) {
            this._howl = null;
            this._currentPlaylistIndex = null;
        }
        this._currentPlaylist = value;
    }

    public get volume(): number {
        if (this._howl) {
            return this._howl.volume();
        }
        else {
            return this._volume;
        }
    }

    public set volume(value: number) {
        if (this._howl) {
            this._howl.volume(value);
        }
        this._volume = value;
    }

    public get playState(): EAudioPlaybackState {
        if (!this._howl) {
            return EAudioPlaybackState.Stopped;
        }
        else if (this._howl.playing()) {
            return EAudioPlaybackState.Playing;
        }
        else {
            return EAudioPlaybackState.Paused;
        }
    }

    public set playState(value: EAudioPlaybackState) {
        if (!this._howl) {
            if (this.currentPlaylist.length == 0) {
                return;
            }
            else if (value === EAudioPlaybackState.Playing){
                this._currentPlaylistIndex = 0;
                this.loadNewAudioAndPlay();
            }
        }
        else if (value === EAudioPlaybackState.Paused) {
            this._howl.pause();
        }
        else if (value === EAudioPlaybackState.Playing) {
            this._howl.play();
        }
    }

    // set new howl to be the first track on the list and play.
    private loadNewAudioAndPlay() {
        this._howl = new Howl({
            src: [this.currentPlaylist[this._currentPlaylistIndex].url],
            volume: this.volume,
            onloaderror: this.onLoadError
        })
        this._howl.once('load', () => {
            this.onFinishLoad();
        })
    }

    private onFinishLoad() {
        this._howl.play();
    }

    private onLoadError(howlId: number, error: string) {
        console.log(`Howler error #${howlId}: ${error}`);
    }
}


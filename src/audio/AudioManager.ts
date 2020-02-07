import { Howl, Holwer } from 'howler';
import { AppIpcAudio } from './AppIpcAudio';
import { IpcMessage } from '../shared/AppIpc/IpcMessage';
import { EAppIpcAction } from '../shared/AppIpc/EAppIpcAction';
import { AudioData } from '../shared/Data/AudioData';
import { EAudioPlayState } from '../shared/Audio/EAudioPlayState';
import { IpcRequest } from '../shared/AppIpc/IpcRequest';

export class AudioManager {
    private appIpcAudio: AppIpcAudio = null;

    private _howl: Howl = null;
    private _currentHowlId: number = null;

    private _volume: number = 0.5;    // the volume should be 0 ~ 1.
    private _currentPlaylistIndex: number = null;
    private _currentPlaylist: AudioData[] = null;
    private _playState: EAudioPlayState

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
        this._currentPlaylistIndex = 0;
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

    public get playState(): EAudioPlayState {
        if (!this._howl) {
            return EAudioPlayState.Stopped;
        }
        else if (this._howl.playing()) {
            return EAudioPlayState.Playing;
        }
        else {
            return EAudioPlayState.Paused;
        }
    }

    public set playState(value: EAudioPlayState) {
        if (!this._howl) {
            return;
        }
        this._playState = value;
        if (value === EAudioPlayState.Paused) {
            this._howl.pause(this._currentHowlId);
        }
        else if (value === EAudioPlayState.Playing) {
            this._howl.play(this._currentHowlId);
        }
        this.appIpcAudio.send2Index(EAppIpcAction.Response, [
            new IpcRequest('playState', this.playState)
        ]);
    }

    // set new howl to be the first track on the list and play.
    public set loadAudioAndPlay(value) {
        if (this._howl) {
            this._howl.stop(this._currentHowlId);
        }
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
        this._currentHowlId = this._howl.play();
        this.playState = EAudioPlayState.Playing;
    }

    private onLoadError(howlId: number, error: string) {
        console.log(`Howler error #${howlId}: ${error}`);
    }
}


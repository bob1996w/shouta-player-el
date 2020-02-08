import { Howl, Holwer } from 'howler';
import { AppIpcAudio } from './AppIpcAudio';
import { IpcMessage } from '../shared/AppIpc/IpcMessage';
import { EAppIpcAction } from '../shared/AppIpc/EAppIpcAction';
import { AudioData } from '../shared/Data/AudioData';
import { EAudioPlayState } from '../shared/Audio/EAudioPlayState';
import { IpcRequest } from '../shared/AppIpc/IpcRequest';
import { TouchBarScrubber, TouchBarButton } from 'electron';

/*  seek time in seconds that:
    when 'previousTrack' is pressed and current seek <= this, load previous audio in the list.
    when 'previousTrack' is pressed and current seek >  this, seek to 0 of the song. */
const thresholdTriggerPreviousTrack: number = 1.0;

/*  time in seconds to seek back/forth when clicking seek button */
const timeSeekButton: number = 10;

export class AudioManager {
    private appIpcAudio: AppIpcAudio = null;

    private _howl: Howl = null;
    private _currentHowlId: number = null;

    private _volume: number = 0.5;    // the volume should be 0 ~ 1.
    private _currentPlaylistIndex: number = null;
    private _currentPlaylist: AudioData[] = null;
    private _playState: EAudioPlayState = null;

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
        this.currentPlaylistIndex = 0;
    }

    public get currentPlaylistIndex(): number {
        return this._currentPlaylistIndex;
    }

    public set currentPlaylistIndex(value: number) {
        this._currentPlaylistIndex = value;
        this.unload();
        this._howl = new Howl({
            src: [this.currentPlaylist[this._currentPlaylistIndex].url],
            volume: this.volume,
            onloaderror: this.onLoadError
        })
        // do not execute onFinishLoad
        this.appIpcAudio.send2Index(EAppIpcAction.Response, [
            new IpcRequest('currentAudioData', this.currentAudioData),
            new IpcRequest('currentPlaylistIndex', this.currentPlaylistIndex)
        ]);
    }

    public get currentAudioData(): AudioData {
        return this.currentPlaylist[this.currentPlaylistIndex];
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
        this.appIpcAudio.send2Index(EAppIpcAction.Response, [
            new IpcRequest('volume', this.volume)
        ]);
    }

    public get playState(): EAudioPlayState {
        return this._playState;
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
            if (this._currentHowlId === null) {
                this._currentHowlId = this._howl.play();
            }
            else {
                this._howl.play(this._currentHowlId);
            }
        }
        this.appIpcAudio.send2Index(EAppIpcAction.Response, [
            new IpcRequest('playState', this.playState)
        ]);
    }

    public get seek(): number {
        if (!this._howl || !this._currentHowlId) {
            return 0;
        }
        let returnValue = this._howl.seek(this._currentHowlId);
        if (typeof returnValue !== 'number') {
            returnValue = 0;
        }
        return returnValue;
    }

    public set seek(value: number) {
        if (!this._howl) {
            return;
        }
        this._howl.seek(value, this._currentHowlId);
        this.appIpcAudio.send2Index(EAppIpcAction.Response, [
            new IpcRequest('seek', this.seek)
        ]);
    }

    public set nextTrack(value) {
        let currentPlayState = this.playState;
        console.log(`currentPlayState: ${currentPlayState}`);
        if (this.currentPlaylist.length == 0) {
            return;
        }
        let newListIndex = this.currentPlaylistIndex + 1;
        if (newListIndex >= this.currentPlaylist.length) {
            newListIndex = 0;
        }
        this.currentPlaylistIndex = newListIndex;
        if (currentPlayState === EAudioPlayState.Playing) {
            this.playState = EAudioPlayState.Playing;
        }
    }

    public set previousTrack(value) {
        let currentPlayState = this.playState;
        if (this.currentPlaylist.length == 0) {
            return;
        }
        if (this.seek > thresholdTriggerPreviousTrack) {
            if (this._howl) {
                this.seek = 0;
            }
        }
        else {
            let newListIndex = this.currentPlaylistIndex - 1;
            if (newListIndex < 0) {
                newListIndex = this.currentPlaylist.length - 1;
            }
            this.currentPlaylistIndex = newListIndex;
            if (currentPlayState == EAudioPlayState.Playing) {
                this.currentPlaylistIndex = newListIndex;
                this.playState = EAudioPlayState.Playing;
            }
        }
    }

    public set seekForward(value) {
        if (!this._howl) {
            return;
        }
        let newSeek = this.seek + timeSeekButton;
        let duration = this.currentPlaylist[this.currentPlaylistIndex].duration;
        if (newSeek >= duration) {
            newSeek = duration;
        }
        this.seek = newSeek;
    }

    public set seekBackward(value) {
        if (!this._howl) {
            return;
        }
        let newSeek = this.seek - timeSeekButton;
        if (newSeek < 0) {
            newSeek = 0;
        }
        this.seek = newSeek;
    }

    // set new howl to be the first track on the list and play.
    public set loadAudioAndPlay(value) {
        this.unload();
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
    
    private unload() {
        if (!this._howl) {
            return;
        }
        this._howl.stop(this._currentHowlId);
        this._howl.unload();
        this._howl = null;
        this._currentHowlId = null;
        this.playState = EAudioPlayState.Stopped;
    }
}


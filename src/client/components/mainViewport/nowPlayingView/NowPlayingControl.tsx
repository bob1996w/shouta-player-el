import * as React from 'react';
import { EAppIpcAction } from '../../../../shared/AppIpc/EAppIpcAction';
import { EAudioPlayState } from '../../../../shared/Audio/EAudioPlayState';
import { IpcRequest } from '../../../../shared/AppIpc/IpcRequest';

export function NowPlayingControl(props: any) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [volume, setVolume] = React.useState(0.0);
    const [seekTime, setSeekTime] = React.useState(0.0);
    const [duration, setDuration] = React.useState(0.0);

    React.useEffect(() => {
        // run once on first render
        props.ipc.on('Audio', EAppIpcAction.Response, (request:string, data: any) => {
            if (request === 'playState') {
                setIsPlaying(data === EAudioPlayState.Playing);
            }
            else if (request === 'volume') {
                setVolume(data);
            }
        });

        props.ipc.send2Audio(EAppIpcAction.Query, [
            new IpcRequest('playState', null),
            new IpcRequest('volume', null)
        ]);

    }, [])

    function buttonPlayOrPause() {
        props.ipc.send2Audio(EAppIpcAction.Update, [
            new IpcRequest('playState', isPlaying? EAudioPlayState.Paused : EAudioPlayState.Playing)
        ]);
    }

    function buttonNextTrack() {
        props.ipc.send2Audio(EAppIpcAction.Update, [
            new IpcRequest('nextTrack', null)
        ]);
    }

    function buttonPreviousTrack() {
        props.ipc.send2Audio(EAppIpcAction.Update, [
            new IpcRequest('previousTrack', null)
        ]);
    }

    function buttonSeekForward() {
        props.ipc.send2Audio(EAppIpcAction.Update, [
            new IpcRequest('seekForward', null)
        ]);
    }

    function buttonSeekBackward() {
        props.ipc.send2Audio(EAppIpcAction.Update, [
            new IpcRequest('seekBackward', null)
        ]);
    }

    function handleVolumeChange(event) {
        setVolume(event.target.value)
        props.ipc.send2Audio(EAppIpcAction.Update, [
            new IpcRequest('volume', event.target.value)
        ]);
    }

    return (
        <div id="nowPlayingControl">
            <div>
                <a href="#" onClick={buttonPreviousTrack}>前</a>
                <a href="#" onClick={buttonSeekBackward}>退</a>
                {isPlaying?
                    <a href="#" onClick={buttonPlayOrPause}>暫</a>
                    :
                    <a href="#" onClick={buttonPlayOrPause}>始</a>
                }
                <a href="#" onClick={buttonSeekForward}>進</a>
                <a href="#" onClick={buttonNextTrack}>次</a>
                <input type="range" name="volume" id="volume" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange}/>
            </div>
            <div id="nowPlayingControl-seekView">
                <p id="nowPlayingControl-seekView-time1">0:00</p>
                <input type="range" name="audio-seek" id="nowPlayingControl-seekView-audioSeek"/>
                <p id="nowPlayingControl-seekView-time2">0:00</p>
            </div>
        </div>
    );
}
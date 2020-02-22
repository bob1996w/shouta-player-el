import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { EAppIpcAction } from '../../../../shared/AppIpc/EAppIpcAction';
import { EAudioPlayState } from '../../../../shared/Audio/EAudioPlayState';
import { IpcRequest } from '../../../../shared/AppIpc/IpcRequest';
import { DisplayFormat } from '../../../../shared/Utility/DisplayFormat';
import { AppIpcIndex } from '../../../AppIpcIndex';
import { DefaultPlayerTheme } from '../../../styles/DefaultTheme';

const ControlButtonDiv = styled.div`
    display: flex;
    align-items: center;
`

const ControlButton = styled.button`
    margin: 0.2em 0.2em;
    height: 2em;
    width: 2em;
    
    border: 0px;
    border-radius: 1.1em;
    background: ${props => props.theme.colors.tone.primary};

    font-size: 1em;
    color: ${props => props.theme.colors.actionText.onPrimary};

    &:focus {
        outline: 0px;
    }
`

const PrimaryControlButton = styled(ControlButton)`
    height: 2em;
    width: 2em;
    border-radius: 1.5em;
    font-size: 1.5em;
`

export function NowPlayingControl(props: any) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [volume, setVolume] = React.useState(0.0);
    const [seekTime, setSeekTime] = React.useState(0.0);
    const [duration, setDuration] = React.useState(0.0);

    // when user drag seekbar, display manualSeekTime instead of seekTime.
    const [isUserDraggingSeek, setIsUserDraggingSeek] = React.useState(false);
    const [manualSeekTime, setManualSeekTime] = React.useState(0.0);

    React.useEffect(() => {
        // run once on first render
        props.ipc.on('Audio', EAppIpcAction.Response, (request:string, data: any) => {
            if (request === 'playState') {
                setIsPlaying(data === EAudioPlayState.Playing);
            }
            else if (request === 'volume') {
                setVolume(data);
            }
            else if (request === 'currentAudioData') {
                setDuration(data.duration);
            }
            else if (request === 'seek') {
                setSeekTime(data);
            }
        });

        props.ipc.send2Audio(EAppIpcAction.Query, [
            new IpcRequest('playState', null),
            new IpcRequest('volume', null)
        ]);

        // poll seek time every 500ms
        setInterval(() => {
            props.ipc.send2Audio(EAppIpcAction.Query, [
                new IpcRequest('seek', null)
            ]);
        }, 500);

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

    function handleSeekChange(event) {
        setManualSeekTime(event.target.value);
    }

    function handleSeekMouseDown(event) {
        setIsUserDraggingSeek(true);
    }

    function handleSeekMouseUp(event) {
        // set manualSeekTime as seekTime.
        setSeekTime(manualSeekTime);
        props.ipc.send2Audio(EAppIpcAction.Update, [
            new IpcRequest('seek', manualSeekTime)
        ]);
        setIsUserDraggingSeek(false);
    }

    return (
        <ThemeProvider theme={DefaultPlayerTheme}>
            <div id="nowPlayingControl">
                <ControlButtonDiv>
                    <ControlButton onClick={buttonPreviousTrack}>前</ControlButton>
                    <ControlButton onClick={buttonSeekBackward}>退</ControlButton>
                    {isPlaying?
                        <PrimaryControlButton onClick={buttonPlayOrPause}>暫</PrimaryControlButton>
                        :
                        <PrimaryControlButton onClick={buttonPlayOrPause}>始</PrimaryControlButton>
                    }
                    <ControlButton onClick={buttonSeekForward}>進</ControlButton>
                    <ControlButton onClick={buttonNextTrack}>次</ControlButton>
                    <input type="range" name="volume" id="volume" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange}/>
                </ControlButtonDiv>
                <div id="nowPlayingControl-seekView">
                    <p id="nowPlayingControl-seekView-time1">
                        {DisplayFormat.seconds2TimeString(isUserDraggingSeek? manualSeekTime : seekTime)}
                    </p>
                    <input type="range" name="seek" id="seek" min="0" max={duration} step="any" 
                            value={isUserDraggingSeek? manualSeekTime : seekTime}
                            onChange={handleSeekChange} 
                            onMouseDown={handleSeekMouseDown} onMouseUp={handleSeekMouseUp}/>
                    <p id="nowPlayingControl-seekView-time2">{DisplayFormat.seconds2TimeString(duration)}</p>
                </div>
            </div>
        </ThemeProvider>
    );
}
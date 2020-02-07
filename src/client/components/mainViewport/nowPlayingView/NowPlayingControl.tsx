import * as React from 'react';
import { EAppIpcAction } from '../../../../shared/AppIpc/EAppIpcAction';
import { EAudioPlayState } from '../../../../shared/Audio/EAudioPlayState';
import { AppIpcRequest } from '../../../../shared/AppIpc/AppIpcRequest';

export function NowPlayingControl(props: any) {
    const [isPlaying, setIsPlaying] = React.useState(false);

    React.useEffect(() => {
        // run once on first render
        props.ipc.on('Audio', EAppIpcAction.Response, (request:string, data: any) => {
            if (request === 'playState') {
                setIsPlaying(data === EAudioPlayState.Playing);
            }
        });

        props.ipc.send2Audio(EAppIpcAction.Query, [
            new AppIpcRequest('playState', null)
        ]);

    }, [])

    function buttonPlayOrPause() {
        props.ipc.send2Audio(EAppIpcAction.Update, [
            new AppIpcRequest('playState', isPlaying? EAudioPlayState.Paused : EAudioPlayState.Playing)
        ]);
    }

    return (
        <div id="nowPlayingControl">
            <div>
                <a href="#">前</a>
                <a href="#">退</a>
                {isPlaying?
                    <a href="#" onClick={buttonPlayOrPause}>暫</a>
                    :
                    <a href="#" onClick={buttonPlayOrPause}>始</a>
                }
                <a href="#">進</a>
                <a href="#">次</a>
                <input type="range" name="volume" id="volume"/>
            </div>
            <div id="nowPlayingControl-seekView">
                <p id="nowPlayingControl-seekView-time1">0:00</p>
                <input type="range" name="audio-seek" id="nowPlayingControl-seekView-audioSeek"/>
                <p id="nowPlayingControl-seekView-time2">0:00</p>
            </div>
        </div>
    );
}
import * as React from 'react';
import * as Path from 'path';
import { EAppIpcAction } from '../../../../shared/AppIpc/EAppIpcAction';

export function NowPlayingInfo(props: any) {
    const [audioTitle, setAudioTitle] = React.useState('');
    const [audioArtist, setAudioArtist] = React.useState('');
    const [audioAlbum, setAudioAlbum] = React.useState('');

    React.useEffect(() => {
        // run once on first render
        props.ipc.on('Audio', EAppIpcAction.Response, (request: string, data: any) => {
            if (request === 'currentAudioData') {
                setAudioTitle(data.metadata.title? data.metadata.title: Path.basename(data.path));
                setAudioArtist(data.metadata.artist? data.metadata.artist: '');
                setAudioAlbum(data.metadata.album? data.metadata.album: '');
            }
        });
    }, [])

    return (
        <div id="nowPlayingInfo">
            <p>{audioTitle}</p>
            <p>{audioArtist}</p>
            <p>{audioAlbum}</p>
        </div>
    );
}
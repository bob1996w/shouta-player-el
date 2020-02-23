import * as React from 'react';
import * as Path from 'path';
import styled , { keyframes } from 'styled-components';
import { EAppIpcAction } from '../../../../shared/AppIpc/EAppIpcAction';

const NowPlayingInfoDiv = styled.div`
    margin: 0.3em;
    padding: 0.2em;
    border-radius: 0.5em;
    background: ${props => props.theme.colors.background.surface};
`

const AuxiliaryText = styled.p`
    font-size: 100%;
    color: ${props => props.theme.colors.text.auxiliary};
    overflow: scroll;
    white-space: nowrap;
`
const TitleText = styled.p`
    font-size: 150%;
    color: ${props => props.theme.colors.text.main};
    overflow: scroll;
    white-space: nowrap;
`

export function NowPlayingInfo(props: any) {
    const [audioTitle, setAudioTitle] = React.useState('Title');
    const [audioArtist, setAudioArtist] = React.useState('Artist');
    const [audioAlbum, setAudioAlbum] = React.useState('Album');

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
        <NowPlayingInfoDiv id="nowPlayingInfo">
            <TitleText>{audioTitle}</TitleText>
            <AuxiliaryText>{audioArtist}</AuxiliaryText>
            <AuxiliaryText>{audioAlbum}</AuxiliaryText>
        </NowPlayingInfoDiv>
    );
}
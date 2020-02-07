import * as React from 'react';
import { NowPlayingInfo } from './nowPlayingInfo';
import { NowPlayingControl } from './nowPlayingControl';

export function NowPlayingView (props: any) {
    return (
        <div id="mainViewport-nowPlayingView">
            <NowPlayingInfo {...props}/>
            <NowPlayingControl {...props}/>
        </div>
    );
}
import * as React from 'react';
import { HeaderView } from './HeaderView';
import { ViewToggle } from './ViewToggle';
import { NowPlayingView } from './nowPlayingView/nowPlayingView';
import { FooterView } from './FooterView';

export function MainViewport (props: any) {
    return (
        <div id="mainViewport-container">
            <HeaderView />
            <ViewToggle />
            <div id="mainViewport-centerView">
                <p>This is center view</p>
            </div>
            <NowPlayingView />
            <FooterView />
        </div>
    )
}
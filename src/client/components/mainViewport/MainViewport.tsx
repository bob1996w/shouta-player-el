import * as React from 'react';
import { HashRouter, Switch, Route} from 'react-router-dom';
import { HeaderView } from './HeaderView';
import { ViewToggle } from './ViewToggle';
import { NowPlayingView } from './nowPlayingView/nowPlayingView';
import { FooterView } from './FooterView';
import { AlbumView } from './centerViews/AlbumView';
import { ListView } from './centerViews/ListView';

export function MainViewport (props: any) {
    return (
        <div id="mainViewport-container">
            <HashRouter>
                <HeaderView />
                <ViewToggle />
                <div id="mainViewport-centerView">
                    <Switch>
                        <Route path="/" exact>
                            <AlbumView />
                        </Route>
                        <Route path="/listView">
                            <ListView />
                        </Route>
                    </Switch>
                </div>
                <NowPlayingView {...props}/>
                <FooterView />
            </HashRouter>
        </div>
    )
}
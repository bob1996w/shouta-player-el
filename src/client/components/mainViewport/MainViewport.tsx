import * as React from 'react';
import { HashRouter, Switch, Route} from 'react-router-dom';
import styled, { ThemeConsumer, ThemeProvider } from 'styled-components';
import { HeaderView } from './HeaderView';
import { ViewToggle } from './ViewToggle';
import { NowPlayingView } from './nowPlayingView/nowPlayingView';
import { FooterView } from './FooterView';
import { AlbumView } from './centerViews/AlbumView';
import { ListView } from './centerViews/ListView';
import { DefaultPlayerTheme } from '../../styles/DefaultTheme';

const MainViewportContainerDiv = styled.div`
    background: ${props => props.theme.colors.background.background};
`

export function MainViewport (props: any) {
    return (
        <ThemeProvider theme={DefaultPlayerTheme}>
            <MainViewportContainerDiv id="mainViewport-container">
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
            </MainViewportContainerDiv>
        </ThemeProvider>
    )
}
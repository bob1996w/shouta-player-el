import * as React from 'react';
import '../styles/index.css';
import { MainViewport } from './mainViewport/MainViewport';
import { AppIpcIndex } from '../AppIpcIndex';

export const App: React.FC<{[propName: string]: any}> = (props) => {
    return (
        <div id="viewport-wrapper">
            <MainViewport {...props}/>
        </div>
    );
}
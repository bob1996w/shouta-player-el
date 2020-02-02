import * as React from 'react';
import '../styles/index.css';
import { MainViewport } from './mainViewport/MainViewport';

export const App: React.FC = (props: any) => {
    return (
        <div id="viewport-wrapper">
            <MainViewport />
        </div>
    );
}
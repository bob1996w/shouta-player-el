import * as React from 'react';
import '../styles/index.css';
import { remote } from 'electron';

export const App: React.FC = (props: any) => {
    return (
        <div>
            <h1>Hello World!</h1>
            <p>electron.getAppPath: {remote.app.getAppPath()}</p>
        </div>
    );
}
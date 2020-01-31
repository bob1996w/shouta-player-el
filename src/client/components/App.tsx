import * as React from 'react';
import '../styles/index.css';

export const App: React.FC = (props: any) => {
    return (
        <div>
            <h1>Hello World!</h1>
            <p>electron.getAppPath: {require('electron').remote.app.getAppPath()}</p>
        </div>
    );
}
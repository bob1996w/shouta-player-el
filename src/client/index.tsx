import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './components/App';
import { AppIpcIndex } from './AppIpcIndex';

let appIpcIndex = new AppIpcIndex();

ReactDOM.render(<App ipc={appIpcIndex}/>, document.getElementById('root'));
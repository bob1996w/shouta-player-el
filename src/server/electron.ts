import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import { AddressInfo } from 'net';
import { platform } from 'os';
import * as portfinder from 'portfinder';

import viewServerApp from './viewServerApp';
import { AppIpcMenuBar } from './AppIpc/AppIpcModules/AppIpcMenuBar';
import { AppIpcCommands } from './AppIpc/AppIpcModules/AppIpcCommands';
import { AppIpcMain } from './AppIpc/AppIpcMain';

// extending global to avoid recycling these references
interface Global extends NodeJS.Global {
    audioClientWindow: BrowserWindow;
    rendererClientWindow: BrowserWindow;
    appIpcCommands: AppIpcCommands;
    appIpcMenuBar: AppIpcMenuBar;
    appIpcMain: AppIpcMain;
}
let g = <Global>global;

let port: number;
let viewServerAppInstance = viewServerApp.getViewServerApp(app.getAppPath());

const gotTheLock = app.requestSingleInstanceLock();

let args = process.argv.slice(2);
console.log(args);

function createWindow (port: number) {

    // Create browser window.
    g.rendererClientWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            devTools: !app.isPackaged
        }
    });

    g.rendererClientWindow.webContents.openDevTools({
        mode: "detach"
    });
    
    // and load index.html of the app.
    if (args.includes('useDevServer')) {
        console.log('useDevServer');
        g.rendererClientWindow.loadURL('http://localhost:10080/');
    }
    else {
        g.rendererClientWindow.loadFile('./static/index.html');
    }

    // Create hidden window for playing audio
    g.audioClientWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            devTools: !app.isPackaged
        }
    })
    //g.audioClientWindow.loadURL(BASE_ADDRESS + '/audio');
    g.audioClientWindow.loadFile('./static/audio.html');
    g.audioClientWindow.webContents.openDevTools({
        mode: "detach"
    });

    g.appIpcMain = new AppIpcMain(g.rendererClientWindow, g.audioClientWindow, ipcMain);
    
    g.appIpcCommands = new AppIpcCommands(app, g.rendererClientWindow, g.appIpcMain);
    g.appIpcMenuBar = new AppIpcMenuBar(app, g.appIpcCommands);
    Menu.setApplicationMenu(g.appIpcMenuBar.menus.Main);

    // when closing the rendererClientWindow
    g.rendererClientWindow.on('close', (event) => {
        if (process.platform === 'darwin') {
            event.preventDefault();
            g.rendererClientWindow.hide();
        }
        // TODO: when windows && minimize to tray
    })
}

if (!gotTheLock) {
    app.quit();
}
else {
    app.on('second-instance', (event, argv, workingDir) => {
        if (g.rendererClientWindow) {
            if (g.rendererClientWindow.isMinimized()) {
                g.rendererClientWindow.restore()
            }
            g.rendererClientWindow.focus();
        }
        // do something with argv...
    });

    app.on('ready', () => {
        portfinder.getPortPromise()
        .then((port) => {
            createWindow(port);
        }).catch((error) => {
            console.error(error);
        });
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        // when dock icon clicked on macOS
        if (g.rendererClientWindow) {
            g.rendererClientWindow.show();
        }
    })
}
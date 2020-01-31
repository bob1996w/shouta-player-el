import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import { AddressInfo } from 'net';
import { platform } from 'os';
import { Server as HttpServer } from 'http';
import * as portfinder from 'portfinder';

import viewServerApp from './viewServerApp';
import { AppIpcMenuBar } from './AppIpc/AppIpcModules/AppIpcMenuBar';
import { AppIpcCommands } from './AppIpc/AppIpcModules/AppIpcCommands';
import { AppIpcMain } from './AppIpc/AppIpcMain';

// extending global to avoid recycling these references
interface Global extends NodeJS.Global {
    viewServer: HttpServer;
    audioClientWindow: BrowserWindow;
    rendererClientWindow: BrowserWindow;
    appIpcCommands: AppIpcCommands;
    appIpcMenuBar: AppIpcMenuBar;
    appIpcMain: AppIpcMain;
}
let g = <Global>global;

let port: number;
let viewServerAppInstance = viewServerApp.getViewServerApp(app.getAppPath());

function createWindow (port: number) {
    let BASE_ADDRESS: string = 'http://localhost:' + port;
    g.viewServer = viewServerAppInstance.listen(port, () => {
        console.log(`View server is running on ${BASE_ADDRESS + '/'}}`);
    })

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
    g.rendererClientWindow.loadFile('./static/index.html');

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

    g.appIpcMain = new AppIpcMain(g.audioClientWindow, ipcMain);
    
    g.appIpcCommands = new AppIpcCommands(app, g.rendererClientWindow, g.appIpcMain);
    g.appIpcMenuBar = new AppIpcMenuBar(app, g.appIpcCommands);
    Menu.setApplicationMenu(g.appIpcMenuBar.menus.Main);

    // when closing the rendererClientWindow
    g.rendererClientWindow.on('closed', () => {
        g.viewServer.close(() => {
            console.log('View Server closed.');
            g.viewServer = null;
        })
        g.audioClientWindow = null;
        g.rendererClientWindow = null;
        g.appIpcCommands = null;
        g.appIpcMain = null;
        g.appIpcMenuBar = null;
    })
}

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
        g.viewServer.close(() => {
            console.log(`View server closed.`);
        });
        app.quit();
    }
});

app.on('activate', () => {
    // when dock icon clicked on macOS
    if (g.rendererClientWindow === null) {
        portfinder.getPortPromise()
        .then((port) => {
            createWindow(port)
        }).catch((err) => {
            console.error(err)
        })
    }
})
import { app, BrowserWindow, Menu } from 'electron';
import { AddressInfo } from 'net';
import { platform } from 'os';
import { Server as HttpServer } from 'http';
import * as portfinder from 'portfinder';

import viewServerApp from './viewServerApp';
import { AppIpcMenuBar } from './AppIpc/AppIpcModules/AppIpcMenuBar';
import { AppIpcCommands } from './AppIpc/AppIpcModules/AppIpcCommands';

// extending global to avoid recycling these references
interface Global extends NodeJS.Global {
    viewServer: HttpServer;
    rendererClientWindow: BrowserWindow;
    appIpcCommands: AppIpcCommands;
    appIpcMenuBar: AppIpcMenuBar;
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
    g.rendererClientWindow.loadURL(BASE_ADDRESS + '/');
    
    g.appIpcCommands = new AppIpcCommands(app, g.rendererClientWindow);
    g.appIpcMenuBar = new AppIpcMenuBar(app, g.appIpcCommands);
    Menu.setApplicationMenu(g.appIpcMenuBar.menus.Main);

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
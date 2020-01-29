import { app, BrowserWindow, Menu } from 'electron';
import { AddressInfo } from 'net';
import viewServerApp from './viewServerApp';
import { platform } from 'os';
import { AppIpcMenuBar } from './AppIpc/AppIpcModules/AppIpcMenuBar';
import { AppIpcCommands } from './AppIpc/AppIpcModules/AppIpcCommands';
import { Server as HttpServer } from 'http';

// extending global to avoid recycling these references
interface Global extends NodeJS.Global {
    viewServer: HttpServer;
    rendererClientWindow: BrowserWindow;
    appIpcCommands: AppIpcCommands;
    appIpcMenuBar: AppIpcMenuBar;
}
let g = <Global>global;

const VIEW_SERVER_PORT = 10010;

const BASE_ADDRESS: string = 'http://localhost:' + VIEW_SERVER_PORT;

const viewServerAppInstance = viewServerApp.getViewServerApp(app.getAppPath());
g.viewServer = viewServerAppInstance.listen(VIEW_SERVER_PORT, () => {
    console.log(`View server is running on ${BASE_ADDRESS + '/'}}`);
})


function createWindow () {
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

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        g.viewServer.close(() => {
            console.log(`View server closed.`);
        });
        app.quit();
    }
});
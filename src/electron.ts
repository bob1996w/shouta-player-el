import { app, BrowserWindow } from 'electron';
import { AddressInfo } from 'net';
import viewServerApp from './viewServerApp';
import { platform } from 'os';



const VIEW_SERVER_PORT = 10010;

const BASE_ADDRESS: string = 'http://localhost:' + VIEW_SERVER_PORT;

const viewServerAppInstance = viewServerApp.getViewServerApp(app.getAppPath());
const viewServer = viewServerAppInstance.listen(VIEW_SERVER_PORT, () => {
    console.log(`View server is running on ${BASE_ADDRESS + '/'}}`);
})


function createWindow () {
    // Create browser window.
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    
    // and load index.html of the app.
    win.loadURL(BASE_ADDRESS + '/');
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        viewServer.close(() => {
            console.log(`View server closed.`);
        });
        app.quit();
    }
});
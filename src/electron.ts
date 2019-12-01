const { app, BrowserWindow } = require('electron');

const view = require('./viewServer');

view.init(app.getAppPath());

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
    // win.loadFile('../src/view/index.html');
}

app.on('ready', createWindow);
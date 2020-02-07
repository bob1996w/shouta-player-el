import { BrowserWindow, IpcMain } from "electron";
import { IpcMessage } from "../../shared/AppIpc/IpcMessage";

export class AppIpcMain {
    private rendererWindow: BrowserWindow = null;
    private audioWindow: BrowserWindow = null;
    private ipcMain: IpcMain = null;

    constructor(rendererWindow: BrowserWindow, audioWindow: BrowserWindow, ipcMain: IpcMain) {
        this.rendererWindow = rendererWindow;
        this.audioWindow = audioWindow;
        this.ipcMain = ipcMain;

        this.ipcMain.on('Message', (event, msg) => {
            this.send(msg);
        })
    }

    public send(msg: IpcMessage) {
        console.log(`main receive message from ${msg.senderModule} to ${msg.receiverModule}`)
        if (msg.receiverModule === "Audio") {
            this.audioWindow.webContents.send("Message", msg);
        }
        if (msg.receiverModule === "Index") {
            this.rendererWindow.webContents.send("Message", msg);
        }
    }
}
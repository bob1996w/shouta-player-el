import { BrowserWindow, IpcMain } from "electron";
import { AppIpcMessage } from "../../shared/AppIpc/AppIpcMessage";

export class AppIpcMain {
    private audioWindow: BrowserWindow = null;
    private ipcMain: IpcMain = null;

    constructor(audioWindow: BrowserWindow, ipcMain: IpcMain) {
        this.audioWindow = audioWindow;
        this.ipcMain = ipcMain;
    }

    public send(msg: AppIpcMessage) {
        if (msg.receiverModule === "Audio") {
            this.audioWindow.webContents.send("FromWebSocket", msg);
        }
    }
}
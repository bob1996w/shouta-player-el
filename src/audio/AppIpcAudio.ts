import  { ipcRenderer, remote } from 'electron';
import { IAppIpcModule } from '../shared/AppIpc/IAppIpcModule';
import { AppIpcMessage } from '../shared/AppIpc/AppIpcMessage';
import { EAppIpcAction } from '../shared/AppIpc/EAppIpcAction';

export class AppIpcAudio implements IAppIpcModule {
    public IpcModuleName = 'Audio';
    private ipcRenderer = ipcRenderer;
    private ipcCallbacks = {};

    constructor() {
        ipcRenderer.on("FromClient", (event, args) => {
            this.OnGetMessage(args);
        })
    }

    public OnGetMessage(msg: AppIpcMessage) {
        if (msg.receiverModule != this.IpcModuleName) {
            return;
        }
        this.ipcCallbacks[msg.senderModule][msg.action](msg.request, msg.data);
    }

    // set callbacks
    public on(senderModule: string, action: EAppIpcAction, callback: (request: string, data: any) => void) {
        if (!this.ipcCallbacks[senderModule]) {
            this.ipcCallbacks[senderModule] = {};
        }
        this.ipcCallbacks[senderModule][action] = callback;
    }
}
import  { ipcRenderer, remote } from 'electron';
import { IAppIpcModule } from '../shared/AppIpc/IAppIpcModule';
import { IpcMessage } from '../shared/AppIpc/IpcMessage';
import { EAppIpcAction } from '../shared/AppIpc/EAppIpcAction';
import { IpcRequest } from '../shared/AppIpc/IpcRequest';

export type ActionCallback = (req: string, data: any) => void;

export class AppIpcAudio implements IAppIpcModule {
    public IpcModuleName = 'Audio';
    private ipcRenderer = ipcRenderer;
    private ipcCallbacks: {
        [senderModule: string]: {
            [action in EAppIpcAction]?: ActionCallback[]
        }
    } = {};

    constructor() {
        ipcRenderer.on("Message", (event, args) => {
            this.OnGetMessage(args);
        })
    }

    public OnGetMessage(msg: IpcMessage) {
        if (msg.receiverModule != this.IpcModuleName) {
            return;
        }
        console.log(msg);
        msg.requests.forEach((req: IpcRequest, index: number, array: IpcRequest[]) => {
            this.ipcCallbacks[msg.senderModule][msg.action].forEach(
                (callback: (request: string, data: any) => void, innderIndex: number, callbacks: {(request: string, data: any): void}[]) => {
                    callback(req.request, req.data);
            });
        });
    }

    // set callbacks
    public on(senderModule: string, action: EAppIpcAction, callback: (request: string, data: any) => void) {
        if (!this.ipcCallbacks[senderModule]) {
            this.ipcCallbacks[senderModule] = {};
        }
        if (!this.ipcCallbacks[senderModule][action]) {
            this.ipcCallbacks[senderModule][action] = [];
        }
        this.ipcCallbacks[senderModule][action].push(callback);
    }

    public send2Index(action: EAppIpcAction, requests: IpcRequest[]) {
        console.log('send2Index')
        console.log(requests)
        this.ipcRenderer.send("Message", new IpcMessage(this.IpcModuleName, 'Index', action, requests));
    }
}
import { EAppIpcAction } from "./EAppIpcAction";
import { IpcRequest } from "./IpcRequest";

export class IpcMessage {
    public senderModule: string = null;
    public receiverModule: string = null;
    public action: EAppIpcAction = EAppIpcAction.Unset;
    public requests: IpcRequest[] = null;
    
    constructor (senderModule: string, receiverModule: string, action: EAppIpcAction, requests: IpcRequest[]) {
        this.senderModule = senderModule;
        this.receiverModule = receiverModule;
        this.action = action;
        this.requests = requests;
    }
}
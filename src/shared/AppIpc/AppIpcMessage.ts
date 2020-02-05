import { EAppIpcAction } from "./EAppIpcAction";
import { AppIpcRequest } from "./AppIpcRequest";

export class AppIpcMessage {
    public senderModule: string = null;
    public receiverModule: string = null;
    public action: EAppIpcAction = EAppIpcAction.Unset;
    public requests: AppIpcRequest[] = null;
    
    constructor (senderModule: string, receiverModule: string, action: EAppIpcAction, requests: AppIpcRequest[]) {
        this.senderModule = senderModule;
        this.receiverModule = receiverModule;
        this.action = action;
        this.requests = requests;
    }
}
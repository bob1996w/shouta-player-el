import { EAppIpcAction } from "./EAppIpcAction";

export class AppIpcMessage {
    public senderModule: string = null;
    public receiverModule: string = null;
    public action: EAppIpcAction = EAppIpcAction.Unset;
    public request: string = null;
    public data: any = null;
    
    constructor (senderModule: string, receiverModule: string, action: EAppIpcAction, request: string, data: any) {
        this.senderModule = senderModule;
        this.receiverModule = receiverModule;
        this.action = action;
        this.request = request;
        this.data = data;
    }
}
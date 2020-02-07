import { IpcMessage } from "./IpcMessage";

export interface IAppIpcModule {
    IpcModuleName: string;
    OnGetMessage(msg: IpcMessage): void;
}
import { AppIpcMessage } from "./AppIpcMessage";

export interface IAppIpcModule {
    IpcModuleName: string;
    OnGetMessage(msg: AppIpcMessage): void;
}
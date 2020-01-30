import { AppIpcMessage } from "../../../shared/AppIpc/AppIpcMessage";

export interface IAppIpcModule {
    IpcModuleName: string;
    OnGetMessage(msg: AppIpcMessage): void;
}
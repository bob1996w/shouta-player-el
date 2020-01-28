import { IAppIpcModule } from "./IAppIpcModule";
import { AppIpcMessage } from "../AppIpcMessage";
import { Menu, App } from "electron";

export class AppIpcMenuBar implements IAppIpcModule {
    public IpcModuleName: string = 'MenuBar';
    private app: App = null;
    private isMac = process.platform === 'darwin';
    public menus: {[name: string]: Menu} = null;
    
    constructor (app: App) {
        this.app = app;
        this.menus = this.buildMenus();
    }

    private buildMenus (): {[name: string]: Menu} {
        return {
            Main: Menu.buildFromTemplate(
                [
                    ... (this.isMac? [{
                        label: this.app.name, 
                        submenu: [
                            { role: <'about'>'about' },
                            { role: <'close'>'close' },
                            { type: <'separator'>'separator' },
                            { role: <'quit'>'quit' }
                        ]
                    }] : []),

                    {
                        label: '&File',
                        submenu: [
                            {
                                label: '&Open Audio...',
                                click: () => {/* open and play song*/}
                            },
                            ...(this.isMac? []: [{
                                role: <'quit'>'quit'
                            }])
                        ]
                    }
                ]
            ),
        };
    }

    public OnGetMessage (meg: AppIpcMessage): void {

    }
}
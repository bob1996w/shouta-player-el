import { dialog, App, BrowserWindow, FileFilter } from 'electron';
import { IAppIpcModule } from "../../../shared/AppIpc/IAppIpcModule";
import { AppIpcMessage } from "../../../shared/AppIpc/AppIpcMessage";
import * as mm from 'music-metadata';
import { AudioData } from '../../../shared/Data/AudioData';
import { EAppIpcAction } from '../../../shared/AppIpc/EAppIpcAction';
import { AppIpcMain } from '../AppIpcMain';
import { AppIpcRequest } from '../../../shared/AppIpc/AppIpcRequest';
import { EAudioPlaybackState } from '../../../shared/Audio/EAudioPlaybackState';

export class AppIpcCommands implements IAppIpcModule {
    public IpcModuleName = 'Commands';
    private self: AppIpcCommands = this;
    private app: App = null;
    private window: BrowserWindow = null;
    private appIpcMain: AppIpcMain = null;

    private parseOptions: mm.IOptions = {
        duration: false,
        skipCovers: true,
    };

    constructor(app: App, window: BrowserWindow, ipcMain: AppIpcMain) {
        this.app = app;
        this.window = window;
        this.appIpcMain = ipcMain;
    }

    public openFileAndPlay() {
        this.openFileDialog().then((result: {canceled: boolean, filePaths: string[]}): Promise<any> => {
            if (result.canceled) return Promise.resolve([]);
            else return Promise.all(result.filePaths.map(this.parseAudioFile.bind(this)));
        }).then((values: any[]) => {
            // currently only send the first song.
            if (values.length > 0) {
                this.send2Audio(EAppIpcAction.Update, [
                    new AppIpcRequest('currentPlaylist', values),
                    new AppIpcRequest('loadAudioAndPlay', null)
                ]);
            }
        }).catch((error) => {
            console.error(error);
        })
    }

    private createFilter(fileType: string, exts: string[]): FileFilter {
        return {
            name: fileType,
            extensions: exts
        }
    }

    private openFileDialog(): Promise<Object> {
        return dialog.showOpenDialog(this.window, {
            filters: [
                this.createFilter('Audio Files', ['flac', 'm4a', 'mp3']),
                this.createFilter('All Files', ['*'])
            ],
            title: 'Open Audio',
            properties: ['openFile', 'multiSelections']
        });
    }

    private parseAudioFile(filePath: string): Promise<AudioData> {
        return mm.parseFile(filePath, this.parseOptions).then((metadata: mm.IAudioMetadata): Promise<any> => {
            return Promise.resolve(new AudioData(filePath, metadata, 'img/defaultCover.png'));
        });
    }

    private send2Audio(action: EAppIpcAction, requests: AppIpcRequest[]) {
        this.appIpcMain.send(new AppIpcMessage(this.IpcModuleName, "Audio", action, requests));
    }

    public OnGetMessage(msg: AppIpcMessage): void {

    }
}
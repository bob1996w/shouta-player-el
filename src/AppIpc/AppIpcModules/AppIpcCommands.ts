import { dialog, App, BrowserWindow, FileFilter } from 'electron';
import { IAppIpcModule } from "./IAppIpcModule";
import { AppIpcMessage } from "../AppIpcMessage";
import * as mm from 'music-metadata';
import { AudioData } from '../../Data/AudioData';

export class AppIpcCommands implements IAppIpcModule {
    public IpcModuleName = 'Commands';
    private app: App = null;
    private window: BrowserWindow = null;

    private parseOptions: mm.IOptions = {
        duration: false,
        skipCovers: true,
    };

    constructor(app: App, window: BrowserWindow) {
        this.app = app;
        this.window = window;
    }

    public openFileAndPlay() {
        this.openFileDialog().then((result: {canceled: boolean, filePaths: string[]}): Promise<any> => {
            if (result.canceled) return Promise.resolve([]);
            else return Promise.all(result.filePaths.map(this.parseAudioFile.bind(this)));
        }).then((values: any[]) => {
            // console.table(values, ['url']);
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

    public OnGetMessage(msg: AppIpcMessage): void {

    }
}
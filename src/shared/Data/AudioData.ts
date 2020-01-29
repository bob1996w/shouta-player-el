import { IAudioMetadata } from "music-metadata";
import { AudioMetaData } from "./AudioMetaData";
import { pathToFileURL } from 'url';

export class AudioData {
    public path: string = null;
    public url: string = null;
    public duration: number = null;
    public metadata: AudioMetaData = null;

    public constructor(filePath: string, metadata: IAudioMetadata, picture: string) {
        this.path = filePath;
        this.url = pathToFileURL(filePath).href;
        this.duration = metadata.format.duration;
        this.metadata = new AudioMetaData(metadata, picture);
    }

    public toString(): string {
        return `AudioData(url = ${this.url})`;
    }

    public log() {
        console.table(this);
        console.table(this.metadata);
    }
}
import { IAudioMetadata } from "music-metadata";

export class AudioMetaData {
    public album: string = null;
    public artist: string = null;
    public albumartist: string = null;
    public comment: string[] = null;
    public date: string = null;
    public disk: { no: number, of: number } = null;
    public genre: string[] = null;
    public picture: string = null;
    public title: string = null;
    public track: { no: number, of: number } = null;
    public year: number = null;

    public constructor();
    public constructor(metadata: IAudioMetadata, picture: string);
    public constructor(metadata?: IAudioMetadata, picture?: string) {
        this.album = metadata? metadata.common.album : null;
        this.artist = metadata? metadata.common.artist : null;
        this.albumartist = metadata? metadata.common.albumartist : null;
        this.comment = metadata? (metadata.common.comment? Array.from(metadata.common.comment) : null) : null;
        this.date = metadata? metadata.common.date : null;
        this.disk = metadata? metadata.common.disk : null;
        this.genre = metadata? (metadata.common.genre? Array.from(metadata.common.genre) : null) : null;
        this.picture = picture? picture : null;
        this.title = metadata? metadata.common.title : null;
        this.track = metadata? metadata.common.track : null;
        this.year = metadata? metadata.common.year : null;
    }
}
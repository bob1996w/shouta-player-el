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

    public constructor(metadata: IAudioMetadata, picture: string) {
        this.album = metadata.common.album;
        this.artist = metadata.common.artist;
        this.albumartist = metadata.common.albumartist;
        this.comment = (metadata.common.comment? Array.from(metadata.common.comment) : null);
        this.date = metadata.common.date;
        this.disk = metadata.common.disk;
        this.genre = (metadata.common.genre? Array.from(metadata.common.genre) : null);
        this.picture = picture;
        this.title = metadata.common.title;
        this.track = metadata.common.track;
        this.year = metadata.common.year;
    }
}
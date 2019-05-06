import { formatDate } from "src/util/date-util";
import { DownloadLinkDTO } from "./download-link";
import { Pagination } from "./pagination";

const KINOPOISK_REGEXP: RegExp = /http:\/\/www\.kinopoisk\.ru/g;

export class PublicationShortViewDTO {
    constructor(public id: number,
        public header: string,
        public note: string,
        public name: string,
        public originalName: string,
        public genres: Array<Genre>,
        public releaseYear: number,
        public coverLink: string,
        public fileSize: number,
        public description: string,
        public additionalInfo: string,
        public publishDate: number,
        public author: string,
        public viewsCount: number,
        public commentsCount: number) {
    }

    public get stringGenres(): string {
        return this.genres.map(g => g.genre).join(", ");
    }

    public get formattedFileSize(): string {
        if (!this.fileSize) {
            return null;
        }
        let fileSizeStr: string;
        if (this.fileSize > 1024) {
            fileSizeStr = (this.fileSize / 1024.0).toFixed(2) + " Гб";
        } else {
            fileSizeStr = this.fileSize + " Мб";
        }
        return fileSizeStr;
    }

    public get formattedPublishDate(): string {
        return formatDate(this.publishDate);
    }
}

export class PublicationsPage {
    constructor(public publications: Array<PublicationShortViewDTO>, public pagination: Pagination) { }
}

export class PublicationViewDTO extends PublicationShortViewDTO {

    private _details: string;

    constructor(id: number,
        header: string,
        note: string,
        name: string,
        originalName: string,
        genres: Array<Genre>,
        releaseYear: number,
        coverLink: string,
        fileSize: number,
        description: string,
        additionalInfo: string,
        publishDate: number,
        author: string,
        viewsCount: number,
        commentsCount: number,
        details: string,
        public downloadLinks: Array<DownloadLinkDTO>) {
        super(id,
            header,
            note,
            name,
            originalName,
            genres,
            releaseYear,
            coverLink,
            fileSize,
            description,
            additionalInfo,
            publishDate,
            author,
            viewsCount,
            commentsCount);
        this.details = details;
    }
    public get details(): string {
        if (this._details) {
            return this._details.replace(KINOPOISK_REGEXP, 'https://www.kinopoisk.ru');
        }
        return this._details;
    }

    public set details(details: string) {
        this._details = details;
    }
}

export enum PublicationType {
    FILM = "films",
    TV_SERIES = "tvseries",
    GAME = "games"
}

export class Genre {
    constructor(public id: string, public genre: string) { }
}

export class Quality {
    constructor(public id: string, public quality: string) { }
}
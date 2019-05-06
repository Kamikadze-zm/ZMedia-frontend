import { PublicationShortViewDTO, PublicationsPage, PublicationViewDTO, Genre, Quality } from "src/publication/publication";
import { Pagination } from "src/publication/pagination";
import { DownloadLinkDTO } from "src/publication/download-link";

export class FilmShortViewDTO extends PublicationShortViewDTO {
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
        public quality: Quality
    ) {
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
    }
}

export class FilmsPage extends PublicationsPage {
    constructor(publications: Array<FilmShortViewDTO>, pagination: Pagination) {
        super(publications, pagination);
    }
}

export class FilmViewDTO extends PublicationViewDTO {
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
        downloadLinks: Array<DownloadLinkDTO>,
        public quality: Quality) {
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
            commentsCount,
            details,
            downloadLinks);
    }
}
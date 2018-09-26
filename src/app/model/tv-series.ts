import { PublicationShortViewDTO, PublicationViewDTO, PublicationDTO, Genre, Quality, PublicationForm, PublicationsPage } from "./publication";
import { DownloadLinkDTO } from "./download-link";
import { Pagination } from "./pagination";
import { FormGroup, FormControl } from "@angular/forms";
import { CustomValidators } from "../validators/custom-validators";

const LINKS_REGEXP = /\d+$/;

export class TvSeriesShortViewDTO extends PublicationShortViewDTO {
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
        public seasonNumber: number,
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

export class TvSeriesPage extends PublicationsPage {
    constructor(publications: Array<TvSeriesShortViewDTO>, pagination: Pagination) {
        super(publications, pagination);
    }
}

export class TvSeriesViewDTO extends PublicationViewDTO {

    private _downloadLinks: Array<DownloadLinkDTO>;

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
        public seasonNumber: number,
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
        this.downloadLinks = downloadLinks;
    }

    private static sortLinks(links: Array<DownloadLinkDTO>): Array<DownloadLinkDTO> {
        if (!links || links.length < 2) {
            return links;
        }
        const seriesNumbers: number[] = new Array(links.length);
        for (let i: number = 0; i < links.length; i++) {
            const desc: string = links[i].description;
            if (desc) {
                const seriesNumber = desc.match(LINKS_REGEXP);
                if (seriesNumber) {
                    seriesNumbers[i] = parseInt(seriesNumber[0]);
                    continue;
                }
            }
            seriesNumbers[i] = -1;
        }
        for (let i = 1; i < links.length; i++) {
            const link: DownloadLinkDTO = links[i];
            const seriesNumber: number = seriesNumbers[i];
            let j = i - 1;
            for (j; j >= 0 && seriesNumbers[j] > seriesNumber; j--) {
                links[j + 1] = links[j];
                seriesNumbers[j + 1] = seriesNumbers[j];
            }
            links[j + 1] = link;
            seriesNumbers[j + 1] = seriesNumber;
        }
        return links;
    }

    public get downloadLinks(): Array<DownloadLinkDTO> {
        return this._downloadLinks;
    }

    public set downloadLinks(downloadLinks: Array<DownloadLinkDTO>) {
        this._downloadLinks = TvSeriesViewDTO.sortLinks(downloadLinks);
    }
}

export class TvSeriesDTO extends PublicationDTO {
    constructor(header: string,
        note: string,
        name: string,
        originalName: string,
        genres: Array<string>,
        releaseYear: number,
        coverLink: string,
        fileSize: number,
        description: string,
        additionalInfo: string,
        details: string,
        downloadLinks: Array<DownloadLinkDTO>,
        public seasonNumber: number,
        public quality: string) {
        super(header,
            note,
            name,
            originalName,
            genres,
            releaseYear,
            coverLink,
            fileSize,
            description,
            additionalInfo,
            details,
            downloadLinks);
    }
}

export abstract class TvSeriesForm extends PublicationForm {

    public static create(): FormGroup {
        let form: FormGroup = super.create();
        form.addControl("seasonNumber", new FormControl(null));
        form.addControl("quality", new FormControl(null, CustomValidators.required("Выберите качество")));
        return form;
    }

    public static update(form: FormGroup, tvSeries: TvSeriesViewDTO): void {
        if (!form || !tvSeries) {
            return;
        }
        super.update(form, tvSeries);
        form.controls['seasonNumber'].setValue(tvSeries.seasonNumber);
        form.controls['quality'].setValue(tvSeries.quality.id);
    }
}
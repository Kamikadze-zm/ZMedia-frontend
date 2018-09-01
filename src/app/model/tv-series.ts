import { PublicationShortViewDTO, PublicationViewDTO, PublicationDTO, Genre, Quality, PublicationForm, PublicationsPage } from "./publication";
import { DownloadLinkDTO } from "./download-link";
import { Pagination } from "./pagination";
import { FormGroup, FormControl } from "@angular/forms";
import { CustomValidators } from "../validators/custom-validators";

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
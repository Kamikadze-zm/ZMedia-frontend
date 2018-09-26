import { DownloadLinkDTO, DownloadLinkForm } from "./download-link";
import { FormGroup, FormControl, FormArray } from "@angular/forms";
import { CustomValidators } from "../validators/custom-validators";
import { formatDate } from "../util/date-util";
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

export abstract class PublicationDTO {
    constructor(public header: string,
        public note: string,
        public name: string,
        public originalName: string,
        public genres: Array<string>,
        public releaseYear: number,
        public coverLink: string,
        public fileSize: number,
        public description: string,
        public additionalInfo: string,
        public details: string,
        public downloadLinks: Array<DownloadLinkDTO>) {
    }
}

export class Genre {
    constructor(public id: string, public genre: string) { }
}

export class Quality {
    constructor(public id: string, public quality: string) { }
}

export abstract class PublicationForm {

    protected static create(): FormGroup {
        return new FormGroup({
            header: new FormControl(null,
                [CustomValidators.required("Заголовок не должен быть пустым"),
                CustomValidators.size(null, 500, "Заголовок должен содержать не более 500 символов")]),
            note: new FormControl(null,
                [CustomValidators.size(null, 100, "Заметка должна содержать не более 100 символов")]),
            name: new FormControl(null,
                [CustomValidators.required("Название не должно быть пустым"),
                CustomValidators.size(null, 300, "Название должно содержать не более 300 символов")]),
            originalName: new FormControl(null,
                [CustomValidators.size(null, 300, "Оригинальное название должно содержать не более 300 символов")]),
            genres: new FormArray([], CustomValidators.required("Выберите жанр")),
            releaseYear: new FormControl(null,
                [CustomValidators.min(1900, "Год должен быть больше или равен 1900"),
                CustomValidators.max(2100, "Год должен быть меньше или равен 2100")]),
            coverLink: new FormControl(null,
                [CustomValidators.required("Выберите обложку")]),
            fileSize: new FormControl(null,
                [CustomValidators.required("Укажите размер файла")]),
            description: new FormControl(null,
                [CustomValidators.size(null, 50000, "Описание должно содержать не более 50000 символов")]),
            additionalInfo: new FormControl(null,
                [CustomValidators.size(null, 50000, "Дополнительная информация должна содержать не более 50000 символов")]),
            details: new FormControl(null,
                [CustomValidators.size(null, 50000, "Подробности должны содержать не более 50000 символов")]),
            downloadLinks: new FormArray(PublicationForm.createDownloadLinksControls(null),
                [CustomValidators.required("Должна быть указана хотя бы одна ссылка")])
        });
    }

    protected static update(form: FormGroup, p: PublicationViewDTO): void {
        if (!form || !p) {
            return;
        }
        const controls = form.controls;
        controls['header'].setValue(p.header);
        controls['note'].setValue(p.note);
        controls['name'].setValue(p.name);
        controls['originalName'].setValue(p.originalName);
        form.setControl('genres', new FormArray(p.genres.map(g => new FormControl(g.id))));
        controls['releaseYear'].setValue(p.releaseYear);
        controls['coverLink'].setValue(p.coverLink);
        controls['fileSize'].setValue(p.fileSize);
        controls['description'].setValue(p.description);
        controls['additionalInfo'].setValue(p.additionalInfo);
        controls['details'].setValue(p.details);
        form.setControl('downloadLinks', new FormArray(this.createDownloadLinksControls(p.downloadLinks)));
    }

    private static createDownloadLinksControls(dowloadLinks: DownloadLinkDTO[]): FormGroup[] {
        if (!dowloadLinks) {
            return [DownloadLinkForm.create(null, null)];
        }
        let controls: FormGroup[] = [];
        dowloadLinks.forEach((l: DownloadLinkDTO) => controls.push(DownloadLinkForm.create(l.description, l.link)));
        return controls;
    }
}

export class NoveltyDTO {

    public path: string;

    constructor(public id: number,
        public header: string,
        public note: string,
        public coverLink: string,
        public description: string,
        public type: PublicationType) {
        this.path = PublicationType[this.type.toUpperCase()];
    }
}

export enum PublicationType {
    FILM = "films",
    TV_SERIES = "tvseries",
    GAME = "games"
}
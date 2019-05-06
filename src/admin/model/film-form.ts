import { FormGroup, FormControl } from "@angular/forms";

import { CustomValidators } from "src/validators/custom-validators";
import { FilmViewDTO } from "src/films/film";
import { PublicationDTO, PublicationForm } from "./publication-form";
import { DownloadLinkDTO } from "src/publication/download-link";

export class FilmDTO extends PublicationDTO {
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

export abstract class FilmForm extends PublicationForm {

    public static create(): FormGroup {
        let form: FormGroup = super.create();
        form.addControl("quality", new FormControl(null, CustomValidators.required("Выберите качество")));
        return form;
    }

    public static update(form: FormGroup, film: FilmViewDTO): void {
        if (!form || !film) {
            return;
        }
        super.update(form, film);
        form.controls['quality'].setValue(film.quality.id);
    }
}
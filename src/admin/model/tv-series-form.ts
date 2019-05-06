import { FormGroup, FormControl } from "@angular/forms";

import { DownloadLinkDTO } from "src/publication/download-link";
import { TvSeriesViewDTO } from "src/tv-series/tv-series";
import { CustomValidators } from "src/validators/custom-validators";
import { PublicationDTO, PublicationForm } from "./publication-form";

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
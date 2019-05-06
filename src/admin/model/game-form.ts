import { FormGroup } from "@angular/forms";

import { DownloadLinkDTO } from "src/publication/download-link";
import { GameViewDTO } from "src/games/game";
import { PublicationDTO, PublicationForm } from "./publication-form";

export class GameDTO extends PublicationDTO {
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
        downloadLinks: Array<DownloadLinkDTO>) {
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

export abstract class GameForm extends PublicationForm {

    public static create(): FormGroup {
        return super.create();
    }

    public static update(form: FormGroup, game: GameViewDTO): void {
        if (!form || !game) {
            return;
        }
        super.update(form, game);
    }
}
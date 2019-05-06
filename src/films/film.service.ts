import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FilmsPage, FilmViewDTO } from './film';
import { PublicationService } from 'src/publication/publication.service';
import { PublicationType } from 'src/publication/publication';

@Injectable()
export class FilmService extends PublicationService<FilmsPage, FilmViewDTO> {

    private filmsUrl: string = `${this.url}${PublicationType.FILM}/`;

    constructor(http: HttpClient) {
        super(http);
    }

    protected getUrl(): string {
        return this.filmsUrl;
    }
}
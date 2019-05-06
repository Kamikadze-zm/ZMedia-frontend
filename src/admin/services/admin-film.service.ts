import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PublicationType } from 'src/publication/publication';
import { AdminPublicationService } from './admin-publication.service';
import { FilmDTO } from '../model/film-form';

@Injectable()
export class AdminFilmService extends AdminPublicationService<FilmDTO> {

    private filmsUrl: string = `${this.url}${PublicationType.FILM}/`;

    constructor(http: HttpClient) {
        super(http);
    }

    protected getUrl(): string {
        return this.filmsUrl;
    }
}
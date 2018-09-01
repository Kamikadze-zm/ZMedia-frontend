import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FilmsPage, FilmViewDTO, FilmDTO } from '../model/film';
import { PublicationService } from './publication.service';
import { PublicationType } from '../model/publication';

@Injectable()
export class FilmService extends PublicationService<FilmsPage, FilmViewDTO, FilmDTO> {

    private filmsUrl: string = `${this.url}${PublicationType.FILM}/`;

    constructor(http: HttpClient) {
        super(http);
    }

    protected getUrl(): string {
        return this.filmsUrl;
    }
}
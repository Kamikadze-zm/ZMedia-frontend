import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PublicationService } from 'src/publication/publication.service';
import { GamesPage, GameViewDTO } from './game';
import { PublicationType } from 'src/publication/publication';

@Injectable()
export class GameService extends PublicationService<GamesPage, GameViewDTO> {

    private gamesUrl: string = `${this.url}${PublicationType.GAME}/`;

    constructor(http: HttpClient) {
        super(http);
    }

    protected getUrl(): string {
        return this.gamesUrl;
    }
}
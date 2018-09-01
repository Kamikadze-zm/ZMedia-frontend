import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PublicationService } from './publication.service';
import { PublicationType } from '../model/publication';
import { GamesPage, GameViewDTO, GameDTO } from '../model/game';

@Injectable()
export class GameService extends PublicationService<GamesPage, GameViewDTO, GameDTO> {

    private gamesUrl: string = `${this.url}${PublicationType.GAME}/`;

    constructor(http: HttpClient) {
        super(http);
    }

    protected getUrl(): string {
        return this.gamesUrl;
    }
}
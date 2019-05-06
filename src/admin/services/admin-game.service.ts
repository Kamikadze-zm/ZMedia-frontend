import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PublicationType } from 'src/publication/publication';
import { AdminPublicationService } from './admin-publication.service';
import { GameDTO } from '../model/game-form';

@Injectable()
export class AdminGameService extends AdminPublicationService<GameDTO> {

    private gamesUrl: string = `${this.url}${PublicationType.GAME}/`;

    constructor(http: HttpClient) {
        super(http);
    }

    protected getUrl(): string {
        return this.gamesUrl;
    }
}
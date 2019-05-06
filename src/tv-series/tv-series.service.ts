import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PublicationService } from 'src/publication/publication.service';
import { TvSeriesPage, TvSeriesViewDTO } from './tv-series';
import { PublicationType } from 'src/publication/publication';

@Injectable()
export class TvSeriesService extends PublicationService<TvSeriesPage, TvSeriesViewDTO> {

    private tvSeriresUrl: string = `${this.url}${PublicationType.TV_SERIES}/`;

    constructor(http: HttpClient) {
        super(http);
    }

    protected getUrl(): string {
        return this.tvSeriresUrl;
    }
}
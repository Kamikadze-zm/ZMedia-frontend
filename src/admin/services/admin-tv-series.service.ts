import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PublicationType } from 'src/publication/publication';
import { AdminPublicationService } from './admin-publication.service';
import { TvSeriesDTO } from '../model/tv-series-form';

@Injectable()
export class AdminTvSeriesService extends AdminPublicationService<TvSeriesDTO> {

    private tvSeriresUrl: string = `${this.url}${PublicationType.TV_SERIES}/`;

    constructor(http: HttpClient) {
        super(http);
    }

    protected getUrl(): string {
        return this.tvSeriresUrl;
    }
}
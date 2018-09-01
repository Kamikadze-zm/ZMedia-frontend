import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PublicationType } from '../model/publication';
import { TvSeriesPage, TvSeriesViewDTO, TvSeriesDTO } from '../model/tv-series';
import { PublicationService } from './publication.service';

@Injectable()
export class TvSeriesService extends PublicationService<TvSeriesPage, TvSeriesViewDTO, TvSeriesDTO> {

    private tvSeriresUrl: string = `${this.url}${PublicationType.TV_SERIES}/`;

    constructor(http: HttpClient) {
        super(http);
    }

    protected getUrl(): string {
        return this.tvSeriresUrl;
    }
}
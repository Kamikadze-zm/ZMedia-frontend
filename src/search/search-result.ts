import { plainToClass } from "class-transformer";
import { PublicationShortViewDTO, PublicationType } from "src/publication/publication";
import { FilmShortViewDTO } from "src/films/film";
import { TvSeriesShortViewDTO } from "src/tv-series/tv-series";
import { GameShortViewDTO } from "src/games/game";


export class SearchResult {

    constructor(public publication: PublicationShortViewDTO, public type: string) {
        const publicationType: PublicationType = PublicationType[type.toUpperCase()];
        switch (publicationType) {
            case PublicationType.FILM:
                this.publication = plainToClass(FilmShortViewDTO, publication);
            case PublicationType.TV_SERIES:
                this.publication = plainToClass(TvSeriesShortViewDTO, publication);
            case PublicationType.GAME:
                this.publication = plainToClass(GameShortViewDTO, publication);
            default:
                this.publication = plainToClass(PublicationShortViewDTO, publication);
        }
    }

    public get path(): string {
        return PublicationType[this.type.toUpperCase()];
    }
}
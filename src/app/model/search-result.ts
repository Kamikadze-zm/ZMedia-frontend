import { PublicationShortViewDTO, PublicationType } from "./publication";
import { FilmShortViewDTO } from "./film";
import { TvSeriesShortViewDTO } from "./tv-series";
import { GameShortViewDTO } from "./game";
import { plainToClass } from "class-transformer";

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
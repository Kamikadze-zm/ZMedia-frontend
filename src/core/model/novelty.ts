export class NoveltyDTO {

    public path: string;

    constructor(public id: number,
        public header: string,
        public note: string,
        public coverLink: string,
        public description: string,
        public type: NoveltyType) {
        this.path = NoveltyType[this.type.toUpperCase()];
    }
}

export enum NoveltyType {
    FILM = "films",
    TV_SERIES = "tvseries",
    GAME = "games"
}
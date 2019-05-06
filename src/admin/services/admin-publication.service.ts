import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { API_PATH } from "src/host-settings";
import { Genre, Quality } from "src/publication/publication";
import { PublicationDTO } from "../model/publication-form";

export abstract class AdminPublicationService<D extends PublicationDTO> {

    protected url: string = API_PATH;

    constructor(private http: HttpClient) { }

    add(publication: D): Observable<number> {
        return this.http.post<number>(this.getUrl(), publication);
    }

    update(id: number, publication: D): Observable<any> {
        return this.http.put<any>(`${this.getUrl()}${id}`, publication);
    }

    deleteById(id: number): Observable<any> {
        return this.http.delete<any>(`${this.getUrl()}${id}`);
    }

    getGenres(): Observable<Genre[]> {
        return this.http.get<Genre[]>(`${this.getUrl()}genres`);
    }

    getQualities(): Observable<Quality[]> {
        return this.http.get<Quality[]>(`${this.getUrl()}qualities`);
    }

    protected abstract getUrl(): string;
}
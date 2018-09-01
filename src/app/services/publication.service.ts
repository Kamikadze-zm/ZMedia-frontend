import { Constants } from "../util/constants";
import { HttpClient, HttpParams } from "@angular/common/http";
import { PublicationsPage, PublicationViewDTO, PublicationDTO, Genre, Quality } from "../model/publication";
import { Observable } from "rxjs";

export abstract class PublicationService<PP extends PublicationsPage, V extends PublicationViewDTO, D extends PublicationDTO> {

    protected url: string = Constants.HOST + `/api/`;

    constructor(private http: HttpClient) { }

    getPage(page: number): Observable<PP> {
        if (!page) {
            page = 1;
        }
        const params = new HttpParams().set("page", page.toString());
        return this.http.get<PP>(this.getUrl(), { params });
    }

    getById(id: number): Observable<V> {
        return this.http.get<V>(`${this.getUrl()}${id}`);
    }

    add(tvSeries: D): Observable<number> {
        return this.http.post<number>(this.getUrl(), tvSeries);
    }

    update(id: number, tvSeries: D): Observable<any> {
        return this.http.put<any>(`${this.getUrl()}${id}`, tvSeries);
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
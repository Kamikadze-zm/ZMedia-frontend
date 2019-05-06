import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

import { API_PATH } from "src/host-settings";
import { PublicationsPage, PublicationViewDTO } from "./publication";

export abstract class PublicationService<PP extends PublicationsPage, V extends PublicationViewDTO> {

    protected url: string = API_PATH;

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

    protected abstract getUrl(): string;
}
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { API_PATH } from "src/host-settings";
import { SearchResult } from "./search-result";

@Injectable()
export class SearchService {

    private url: string = API_PATH + "search/";

    constructor(private http: HttpClient) { }

    searchByName(name: string): Observable<SearchResult[]> {
        return this.http.get<SearchResult[]>(`${this.url}byname/${name}`);
    }
}
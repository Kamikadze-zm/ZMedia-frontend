import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Constants } from "../util/constants";
import { Observable } from "rxjs";
import { SearchResult } from "../model/search-result";

@Injectable()
export class SearchService {

    private url: string = Constants.HOST + "/api/search/";

    constructor(private http: HttpClient) { }

    searchByName(name: string): Observable<SearchResult[]> {
        return this.http.get<SearchResult[]>(`${this.url}byname/${name}`);
    }
}
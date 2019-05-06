import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_PATH } from 'src/host-settings';
import { NoveltyDTO } from '../model/novelty';

@Injectable()
export class NoveltiesService {

    private url: string = API_PATH + "novelties";

    constructor(private http: HttpClient) { }

    getNovelties(): Observable<NoveltyDTO[]> {
        return this.http.get<NoveltyDTO[]>(this.url);
    }

}
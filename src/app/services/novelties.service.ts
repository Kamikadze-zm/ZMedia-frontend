import { NoveltyDTO } from '../model/publication';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../util/constants';

@Injectable()
export class NoveltiesService {

    private url: string = Constants.HOST + "/api/novelties";

    constructor(private http: HttpClient) { }

    getNovelties(): Observable<NoveltyDTO[]> {
        return this.http.get<NoveltyDTO[]>(this.url);
    }

}
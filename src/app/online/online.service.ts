import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../util/constants';
import { StreamInfo } from './stream-info';

@Injectable()
export class OnlineService {

    private url: string = Constants.HOST + "/api/online/";

    constructor(private http: HttpClient) { }

    getStreamInfo(): Observable<StreamInfo> {
        return this.http.get<StreamInfo>(`${this.url}`);
    }
}
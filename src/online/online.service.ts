import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { StreamInfo } from './stream-info';
import { API_PATH } from 'src/host-settings';

@Injectable()
export class OnlineService {

    private url: string = API_PATH + "online/";

    constructor(private http: HttpClient) { }

    getStreamInfo(): Observable<StreamInfo> {
        return this.http.get<StreamInfo>(`${this.url}`);
    }
}
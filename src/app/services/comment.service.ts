import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../util/constants';
import { PublicationType } from '../model/publication';
import { CommentViewDTO, CommentDTO } from '../model/comment';

@Injectable()
export class CommentService {

    private url: string = Constants.HOST + "/api/";

    constructor(private http: HttpClient) { }

    getCommentsForPublication(type: PublicationType, publicationId: number) {
        return this.http.get<CommentViewDTO[]>(`${this.url}${type}/${publicationId}/comments`);
    }

    add(comment: CommentDTO, type: PublicationType, publicationId: number): Observable<any> {
        return this.http.post<any>(`${this.url}${type}/${publicationId}/comments`, comment);
    }

    update(id: number, comment: CommentDTO, type: PublicationType): Observable<any> {
        return this.http.put<any>(`${this.url}${type}/comments/${id}`, comment);
    }

    deleteById(id: number, type: PublicationType): Observable<any> {
        return this.http.delete<any>(`${this.url}${type}/comments/${id}`);
    }

    realDelete(id: number, type: PublicationType): Observable<any> {
        const params = new HttpParams().set('real', 'true');
        return this.http.delete<any>(`${this.url}${type}/comments/${id}`, { params });
    }
}
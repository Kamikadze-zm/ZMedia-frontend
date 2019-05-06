import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_PATH } from 'src/host-settings';
import { PublicationType } from 'src/publication/publication';
import { CommentViewDTO } from './comment';
import { CommentDTO } from './comment-form';

@Injectable()
export class CommentService {

    private readonly url: string = API_PATH;
    private readonly commentsPart: string = 'comments';

    constructor(private http: HttpClient) { }

    getCommentsForPublication(type: PublicationType, publicationId: number) {
        return this.http.get<CommentViewDTO[]>(`${this.url}${type}/${publicationId}/${this.commentsPart}`);
    }

    add(comment: CommentDTO, type: PublicationType, publicationId: number): Observable<any> {
        return this.http.post<any>(`${this.url}${type}/${publicationId}/${this.commentsPart}`, comment);
    }

    update(id: number, comment: CommentDTO, type: PublicationType): Observable<any> {
        return this.http.put<any>(`${this.url}${type}/${this.commentsPart}/${id}`, comment);
    }

    deleteById(id: number, type: PublicationType): Observable<any> {
        return this.http.delete<any>(`${this.url}${type}/${this.commentsPart}/${id}`);
    }

    realDelete(id: number, type: PublicationType): Observable<any> {
        const params = new HttpParams().set('real', 'true');
        return this.http.delete<any>(`${this.url}${type}/${this.commentsPart}/${id}`, { params });
    }
}
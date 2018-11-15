import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../util/constants';
import { RegistrationDTO } from '../model/registration';
import { NewPasswordDTO } from '../model/password';

@Injectable()
export class AccountService {

    private url: string = Constants.HOST + "/api/account/";

    private emailParam: string = "email";
    private nameParam: string = "name";

    constructor(private http: HttpClient) { }

    register(registration: RegistrationDTO): Observable<any> {
        return this.http.post<any>(`${this.url}registration`, registration);
    }

    existEmail(email: string): Observable<boolean> {
        return this.exist(this.emailParam, email);
    }

    existName(name: string): Observable<boolean> {
        return this.exist(this.nameParam, name);
    }

    exist(param: string, value: string): Observable<boolean> {
        const params = new HttpParams().set("value", value);
        return this.http.get<boolean>(`${this.url}exist/${param}`, { params });
    }

    sendConfirmationMessage(): Observable<any> {
        return this.http.get<any>(`${this.url}confirmation-message`);
    }

    confirmEmail(code: string): Observable<any> {
        return this.http.get<boolean>(`${this.url}email-confirm/${code}`);
    }

    sendPasswordRestoringMessage(email: string): Observable<any> {
        return this.http.get<any>(`${this.url}password-restoring-message/${email}/`);
    }

    restorePassword(code: string, passwordForm: NewPasswordDTO): Observable<any> {
        return this.http.post<any>(`${this.url}password-restoring/${code}`, passwordForm);
    }
}
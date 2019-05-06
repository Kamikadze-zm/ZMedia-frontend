import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { isSupported } from '@firebase/messaging'
import { messaging } from 'firebase/app';

import { API_PATH } from "src/host-settings";

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {

    private readonly NOTIFICATIONS_TOKEN_KEY: string = "notifications-token";

    private url: string = API_PATH + "notifications/token";

    private messaging: messaging.Messaging;

    private _notificationsToken: string;

    public isSubscribed$: BehaviorSubject<boolean>;

    constructor(private http: HttpClient) {
        if (!isSupported()) {
            return;
        }
        this.messaging = messaging();
        this.messaging.usePublicVapidKey("BHBUcRbzxMTMS0ORmBe9tYk0N4cpKJIBQxTHw-NQ2TNqy2EfnQhKP_0RTGtxggFHrrqBrcipCG14YXRshVsjcqc");
        this.isSubscribed$ = new BehaviorSubject<boolean>(this.isSubscribed());
        this.messaging.onTokenRefresh(
            () => this.saveToken(),
            (err) => {
                console.error(err);
                this.deleteToken();
            });
    }

    subscribe(): void {
        if (!isSupported()) {
            return;
        }
        this.messaging.requestPermission()
            .then(() => {
                this.saveToken();
            })
            .catch(err => console.error(err));
    }

    isSubscribed(): boolean {
        if (this.notificationsToken) {
            return true;
        }
        return false;
    }

    unsubscribe(): void {
        if (!isSupported()) {
            return;
        }
        if (this.notificationsToken) {
            this.deleteToken();
        }
    }

    private saveToken(): void {
        this.messaging.getToken().then((token: string) => {
            if (token) {
                this.updateToken(token);
            } else {
                this.deleteToken();
            }
        }).catch(err => {
            console.error(err);
            this.deleteToken();
        })
    }

    private updateToken(token: string): void {
        if (token == this.notificationsToken) {
            return;
        }
        if (this.notificationsToken) {
            this.deleteToken();
        }
        this.http.post<any>(this.url, token).subscribe(
            () => this.setItem(token),
            err => {
                alert('Не удалось подписаться, повторите попытку');
                console.error(err);
            }
        );
    }

    private deleteToken(): void {
        const token: string = this.notificationsToken;
        if (token) {
            this.http.delete<any>(`${this.url}/${token}`).subscribe(
                () => {
                    this.messaging.deleteToken(token).then(deleted => {
                        if (deleted) {
                            this.removeItem();
                        }
                    }).catch(err => {
                        if (err.message && err.message.indexOf('delete-token-not-found') !== -1) {
                            this.removeItem();
                        }
                    })
                },
                err => console.error(err)
            );
        }

    }

    private updateSubject() {
        this.isSubscribed$.next(this.isSubscribed());
    }

    private get notificationsToken(): string {
        if (!this._notificationsToken) {
            this._notificationsToken = localStorage.getItem(this.NOTIFICATIONS_TOKEN_KEY);
        }
        return this._notificationsToken;
    }

    private setItem(token: string): void {
        localStorage.setItem(this.NOTIFICATIONS_TOKEN_KEY, token);
        this._notificationsToken = token;
        this.updateSubject();
    }

    private removeItem(): void {
        localStorage.removeItem(this.NOTIFICATIONS_TOKEN_KEY);
        this._notificationsToken = null;
        this.updateSubject();
    }
}
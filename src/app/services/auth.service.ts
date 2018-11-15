import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Constants } from "../util/constants";
import { UserCredentials } from "../model/user-credentials";
import { Base64 } from "js-base64"
import { User, Role } from "../model/user";
import { Observable, Subject, BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private static USER_KEY: string = "user";
    private static ACCESS_TOKEN_KEY: string = "access-token";
    private static ACCESS_TOKEN_EXP_DATE_KEY: string = "access-token-exp-date";
    private static REFRESH_TOKEN_ID_KEY: string = "refresh-token-id";
    private static REFRESH_TOKEN_KEY: string = "refresh-token";
    private static REFRESH_TOKEN_EXP_DATE_KEY: string = "refresh-token-exp-date";

    private url: string = Constants.HOST + "/api/";

    private _user: User;
    private _accessToken: string;
    private _accessTokenExpDate: number;
    private _refreshTokenId: string;
    private _refreshToken: string;
    private _refreshTokenExpDate: number;

    public isAuthenticated$: BehaviorSubject<boolean>;

    constructor(private http: HttpClient) {
        this.isAuthenticated$ = new BehaviorSubject<boolean>(this.isAuthenticatedOrCanRefresh());
    }

    login(userCredentials: UserCredentials): Observable<boolean> {
        let authenticated: Subject<boolean> = new Subject<boolean>();
        this.http.post<string>(`${this.url}login`, userCredentials).subscribe(
            (tokens: string) => {
                this.parseTokens(tokens);
                authenticated.next(true);
                authenticated.complete();
            },
            (err) => {
                if (err && err.status === 401) {
                    authenticated.next(false);
                    authenticated.complete();
                } else {
                    authenticated.error(err);
                }
            });
        return authenticated.asObservable();
    }

    logout(): void {
        if (this.refreshTokenId) {
            const params = new HttpParams().set("refresh-token-id", this.refreshTokenId);
            this.http.get(`${this.url}logout`, { params }).subscribe();
        } else {
            this.http.get(`${this.url}logout`).subscribe();
        }
        localStorage.removeItem(AuthService.USER_KEY);
        localStorage.removeItem(AuthService.ACCESS_TOKEN_KEY);
        localStorage.removeItem(AuthService.ACCESS_TOKEN_EXP_DATE_KEY);
        localStorage.removeItem(AuthService.REFRESH_TOKEN_ID_KEY);
        localStorage.removeItem(AuthService.REFRESH_TOKEN_KEY);
        localStorage.removeItem(AuthService.REFRESH_TOKEN_EXP_DATE_KEY);
        this._user = null;
        this._accessToken = null;
        this._accessTokenExpDate = null;
        this._refreshTokenId = null;
        this._refreshToken = null;
        this._refreshTokenExpDate = null;
        this.updateAuthenticationObservable();
    }

    refreshAccessToken(): Observable<boolean> {
        let refreshed: Subject<boolean> = new Subject<boolean>();
        if (this.canRefresh()) {
            let options = { headers: new HttpHeaders().set('Content-Type', 'application/json;charset=UTF-8') };
            this.http.post(`${Constants.HOST}/api/account/refresh-token`, this.refreshToken, options).subscribe(
                (accessToken: string) => {
                    this.parseAccessToken(accessToken);
                    refreshed.next(true);
                    refreshed.complete();
                },
                (err) => {
                    refreshed.error(err);
                });
        } else {
            refreshed.error("Token is missing or expired");
        }
        return refreshed.asObservable();
    }

    isAuthenticated(): boolean {
        if (this.user && this.accessToken && this.accessTokenExpDate &&
            this.accessTokenExpDate > (new Date().getTime() + 60000)) {
            return true;
        }
        return false;
    }

    isAuthenticatedOrCanRefresh(): boolean {
        return this.isAuthenticated() || this.canRefresh();
    }

    hasRole(role: Role): boolean {
        if (!this.user) {
            return false;
        }
        return this.user.hasRole(role);
    }

    hasStringRole(role: string): boolean {
        if (!this.user) {
            return false;
        }
        return this.user.hasStringRole(role);
    }

    canRefresh(): boolean {
        if (this.refreshToken && this.refreshTokenExpDate
            && this.refreshTokenExpDate > (new Date().getTime() + 60000)) {
            return true;
        }
        return false;
    }

    private updateAuthenticationObservable() {
        this.isAuthenticated$.next(this.isAuthenticatedOrCanRefresh());
    }

    private parseTokens(tokens: string): void {
        this.parseAccessToken(tokens["accessToken"]);
        this.parseRefreshToken(tokens["refreshToken"]);
    }

    private parseAccessToken(token: string): void {
        let payload: object = JSON.parse(Base64.decode(token.split(".")[1]));
        let stringRole: string = payload["role"];
        let role: Role = null;
        if (stringRole && stringRole.length > 0) {
            role = Role[stringRole.toUpperCase()];
        }
        let user: User = new User(payload["sub"], payload["name"], role, payload["avatar"], payload["confirmed"]);
        let expDate: string = payload["exp"] + "000";
        localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
        this._user = user;
        localStorage.setItem(AuthService.ACCESS_TOKEN_KEY, token);
        this._accessToken = token;
        localStorage.setItem(AuthService.ACCESS_TOKEN_EXP_DATE_KEY, expDate);
        this._accessTokenExpDate = Number.parseInt(expDate);
        this.updateAuthenticationObservable();
    }

    private parseRefreshToken(token: string): void {
        let payload: object = JSON.parse(Base64.decode(token.split(".")[1]));
        let tokenId: string = payload["jti"];
        let expDate: string = payload["exp"] + "000";
        localStorage.setItem(AuthService.REFRESH_TOKEN_ID_KEY, tokenId);
        this._refreshTokenId = tokenId;
        localStorage.setItem(AuthService.REFRESH_TOKEN_KEY, token);
        this._refreshToken = token;
        localStorage.setItem(AuthService.REFRESH_TOKEN_EXP_DATE_KEY, expDate);
        this._refreshTokenExpDate = Number.parseInt(expDate);
    }

    public get user(): User {
        if (!this._user) {
            const jsonUser = localStorage.getItem(AuthService.USER_KEY);
            if (jsonUser) {
                const user: User = JSON.parse(jsonUser);
                this._user = new User(user.email, user.name, user.role, user.avatar, user.confirmed);
            }
        }
        return this._user;
    }

    public get accessToken(): string {
        if (!this._accessToken) {
            this._accessToken = localStorage.getItem(AuthService.ACCESS_TOKEN_KEY);
        }
        return this._accessToken;
    }

    public get accessTokenExpDate(): number {
        if (!this._accessTokenExpDate) {
            let expDate = localStorage.getItem(AuthService.ACCESS_TOKEN_EXP_DATE_KEY);
            if (expDate) {
                this._accessTokenExpDate = Number.parseInt(expDate);
            }
        }
        return this._accessTokenExpDate;
    }

    public get refreshTokenId(): string {
        if (!this._refreshTokenId) {
            this._refreshTokenId = localStorage.getItem(AuthService.REFRESH_TOKEN_ID_KEY);
        }
        return this._refreshTokenId;
    }

    public get refreshToken(): string {
        if (!this._refreshToken) {
            this._refreshToken = localStorage.getItem(AuthService.REFRESH_TOKEN_KEY);
        }
        return this._refreshToken;
    }

    public get refreshTokenExpDate(): number {
        if (!this._refreshTokenExpDate) {
            let expDate = localStorage.getItem(AuthService.REFRESH_TOKEN_EXP_DATE_KEY);
            if (expDate) {
                this._refreshTokenExpDate = Number.parseInt(expDate);
            }
        }
        return this._refreshTokenExpDate;
    }
}
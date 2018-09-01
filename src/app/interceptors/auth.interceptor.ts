import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable, Subscriber, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

type CallerRequest = {
    subscriber: Subscriber<any>;
    request: HttpRequest<any>;
};

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private headerName: string = "Authorization";
    private headerPrefix: string = "Bearer ";

    private http: HttpClient;
    private authService: AuthService;

    private tokenRefreshing = false;

    private requests: CallerRequest[] = [];

    constructor(private router: Router, private injector: Injector) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url.includes('/refresh-token') || request.url.includes('/login') || !request.url.includes('/api/')) {
            return next.handle(request);
        }
        if (!this.authService) {
            this.authService = this.injector.get(AuthService);
        }
        if (this.authService.isAuthenticated()) {
            return next.handle(this.setAuthorizationHeader(request));
        }
        let observable = new Observable<HttpEvent<any>>((subscriber) => {
            let originalRequestSubscription: Subscription = next.handle(request).subscribe(
                (response: HttpEvent<any>) => {
                    subscriber.next(response);
                },
                (err) => {
                    if (err.status === 401) {
                        this.handleUnauthorizedError(subscriber, request);
                    } else {
                        subscriber.error(err);
                    }
                },
                () => {
                    subscriber.complete();
                });
            return () => {
                originalRequestSubscription.unsubscribe();
            };
        });
        return observable;
    }

    private setAuthorizationHeader(request: HttpRequest<any>): HttpRequest<any> {
        const token = this.authService.accessToken;
        return request.clone({ headers: request.headers.set(this.headerName, `${this.headerPrefix}${token}`) });
    }

    private redirectToLoginPage(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    private handleUnauthorizedError(subscriber: Subscriber<any>, request: HttpRequest<any>): void {
        this.requests.push({ subscriber, request });
        if (!this.tokenRefreshing) {
            this.tokenRefreshing = true;
            this.authService.refreshAccessToken().subscribe(
                (refreshed: boolean) => {
                    this.tokenRefreshing = false;
                    if (refreshed) {
                        this.repeatRequests();
                    }
                },
                () => {
                    this.tokenRefreshing = false;
                    this.redirectToLoginPage();
                });
        }
    }

    private repeatRequests(): void {
        if (!this.http) {
            this.http = this.injector.get(HttpClient);
        }
        this.requests.forEach((r) => {
            this.http.request(this.setAuthorizationHeader(r.request)).subscribe(
                (response) => {
                    r.subscriber.next(response);
                },
                (err) => {
                    r.subscriber.error(err);
                },
                () => {
                    r.subscriber.complete();
                });
        });
        this.requests = [];
    }
}
import { Injectable, ErrorHandler, Injector, NgZone } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { ErrorService } from "./error.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    private router: Router;
    private errorService: ErrorService;
    private zone: NgZone;

    constructor(private inj: Injector) { }

    handleError(error: Error) {
        if (!this.router) {
            this.router = this.inj.get(Router);
        }
        if (error instanceof HttpErrorResponse) {
            const httpError: HttpErrorResponse = error as HttpErrorResponse;
            switch (httpError.status) {
                case 404:
                    this.router.navigate(['/404']);
                    return;
                case 403:
                    this.router.navigate(['/403']);
                    return;
            }
        }
        if (!this.errorService) {
            this.errorService = this.inj.get(ErrorService);
        }
        this.errorService.push(error);
        this.navigateToErrorComponent();
    }

    private navigateToErrorComponent(): void {
        if (!this.zone) {
            this.zone = this.inj.get(NgZone);
        }
        this.zone.run(() => this.router.navigate(['/error']));
    }
}
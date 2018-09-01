import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) { }
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.authService.isAuthenticatedOrCanRefresh()) {
            let role: string = next.data["role"];
            if (role) {
                if (this.authService.hasStringRole(role)) {
                    return true;
                } else {
                    this.router.navigate(['/403']);
                    return false;
                }
            } else {
                return true;
            }
        }
        this.router.navigate(['/login'], { queryParams: { targetUrl: state.url } });
        return false;
    }
}
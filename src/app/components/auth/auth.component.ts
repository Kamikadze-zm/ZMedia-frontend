import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrls: []
})
export class AuthComponent implements OnInit, OnDestroy {

  isAuthenticated: boolean = false;
  private isAuthenticatedSub: Subscription;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (!this.authService) {
      return this.isAuthenticated = false;
    }
    this.isAuthenticatedSub = this.authService.isAuthenticated$.subscribe((a: boolean) => {
      this.isAuthenticated = a || this.authService.canRefresh();
    });
    //this.authService.isAuthenticated();
  }

  ngOnDestroy() {
    this.isAuthenticatedSub.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
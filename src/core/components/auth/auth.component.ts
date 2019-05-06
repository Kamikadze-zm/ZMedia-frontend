import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'auth',
  templateUrl: './auth.component.html'
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
  }

  ngOnDestroy() {
    this.isAuthenticatedSub.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
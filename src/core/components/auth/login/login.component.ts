import { Component } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { UserCredentials } from '../../../model/user-credentials';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  userCredentials: UserCredentials = new UserCredentials("", "");
  error: boolean = false;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  login() {
    let snapshot: ActivatedRouteSnapshot = this.route.snapshot;
    this.authService.login(this.userCredentials).subscribe(
      (isSuccessful: boolean) => {
        if (isSuccessful) {
          const targetUrl: string = snapshot.queryParamMap.get('targetUrl');
          if (targetUrl) {
            this.router.navigateByUrl(targetUrl);
          } else {
            this.router.navigate(['/']);
          }
        } else {
          this.error = true;
        }
      });
  }
}
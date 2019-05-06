import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/core/services/auth.service';
import { User } from 'src/core/model/user';
import { isVerificationCodeError } from 'src/core/model/error';
import { AccountService } from '../account.service';
import { Messages } from '../messages';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  providers: [AccountService]
})
export class EmailConfirmationComponent implements OnInit, OnDestroy {

  message: string;

  private paramsSub: Subscription;

  constructor(private accountService: AccountService,
    private authService: AuthService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    const user: User = this.authService.user;
    if (user && user.confirmed) {
      this.message = 'Email адрес уже подтвержден';
    } else {
      this.message = 'Производится подтверждение, пожалуйста, подождите';
      this.paramsSub = this.route.params.subscribe(params => {
        const code: string = params['code'];
        this.confirmEmail(code);
      });
    }
  }

  confirmEmail(code: string): void {
    if (!code) {
      this.message = 'Некорректная ссылка';
    }
    this.accountService.confirmEmail(code).subscribe(
      () => {
        this.message = 'Email адрес успешно подтвержден';
        this.authService.refreshAccessToken();
      },
      (err => {
        if (isVerificationCodeError(err)) {
          this.message = Messages.INVALID_VERIFICATION_CODE_MESSAGE;
        } else {
          throw err;
        }
      }));
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }
}
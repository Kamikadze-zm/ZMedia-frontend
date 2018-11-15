import { Component } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { FormControl } from '@angular/forms';
import { isMessageError } from 'src/app/model/error';

@Component({
  selector: 'app-password-restoring-request',
  templateUrl: './password-restoring-request.component.html',
  providers: [AccountService]
})
export class PasswordRestoringRequestComponent {

  emailControl: FormControl;
  success: boolean = false;
  error: string;

  constructor(private accountService: AccountService) {
    this.emailControl = new FormControl(null);
  }

  sendMessage(): void {
    const email: string = this.emailControl.value;
    if (!email) {
      this.error = 'Введите email';
      return;
    }
    this.accountService.sendPasswordRestoringMessage(email).subscribe(
      () => {
        this.success = true;
      },
      (err => {
        if (isMessageError(err)) {
          this.error = err.error.message;
        } else {
          throw err;
        }
      }));
  }
}
import { Component, OnInit } from '@angular/core';

import { User } from 'src/core/model/user';
import { AuthService } from 'src/core/services/auth.service';
import { SnackbarService } from 'src/core/services/snackbar.service';
import { AccountService } from '../account.service';
import { Messages } from '../messages';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  providers: [AccountService]
})
export class AccountComponent implements OnInit {

  user: User;

  constructor(private accountService: AccountService,
    private authService: AuthService,
    private snackBar: SnackbarService) { }

  ngOnInit() {
    this.user = this.authService.user;
  }

  sendMessage() {
    this.accountService.sendConfirmationMessage().subscribe(() => {
      this.snackBar.show(Messages.EMIAL_CONFIRMATION_SENDED_MESSAGE);
    })
  }
}
import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { AuthService } from '../../../services/auth.service';
import { User } from 'src/app/model/user';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Constants } from 'src/app/util/constants';

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
      this.snackBar.show(Constants.EMIAL_CONFIRMATION_SENDED_MESSAGE);
    })
  }
}
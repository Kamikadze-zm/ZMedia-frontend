import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { RegistrationComponent } from './registration/registration.component';
import { AccountComponent } from './account/account.component';
import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';
import { PasswordRestoringRequestComponent } from './password-restoring-request/password-restoring-request.component';
import { PasswordRestoringComponent } from './password-restoring/password-restoring.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AccountRoutingModule
  ],
  declarations: [
    RegistrationComponent,
    AccountComponent,
    EmailConfirmationComponent,
    PasswordRestoringRequestComponent,
    PasswordRestoringComponent
  ]
})
export class AccountModule { }

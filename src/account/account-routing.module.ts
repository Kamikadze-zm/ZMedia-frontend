import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'src/core/guards/auth.guard';
import { AccountComponent } from './account/account.component';
import { RegistrationComponent } from './registration/registration.component';
import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';
import { PasswordRestoringRequestComponent } from './password-restoring-request/password-restoring-request.component';
import { PasswordRestoringComponent } from './password-restoring/password-restoring.component';

const routes: Routes = [
  { path: '', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'registration', component: RegistrationComponent },
  { path: 'email-confirm/:code', component: EmailConfirmationComponent },
  { path: 'password-restoring', component: PasswordRestoringRequestComponent },
  { path: 'password-restoring/:code', component: PasswordRestoringComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }

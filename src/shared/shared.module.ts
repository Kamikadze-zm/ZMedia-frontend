import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticatedDirective } from './directives/auth/authenticated.directive';
import { AuthorizedDirective } from './directives/auth/authorized.directive';
import { NotAuthenticatedDirective } from './directives/auth/not-authenticated.directive';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AuthenticatedDirective,
    AuthorizedDirective,
    NotAuthenticatedDirective,
    SafeHtmlPipe,
    SafeUrlPipe
  ], exports: [
    AuthenticatedDirective,
    AuthorizedDirective,
    NotAuthenticatedDirective,
    SafeHtmlPipe,
    SafeUrlPipe
  ]
})
export class SharedModule { }

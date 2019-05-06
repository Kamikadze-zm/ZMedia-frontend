import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material';

import { CoreRoutingModule } from './core-routing.module';

import { AuthInterceptor } from './interceptors/auth.interceptor';
import { GlobalErrorHandler } from './error-handler/global-error-handler';

import { AccessDeniedComponent } from './error-handler/403/access-denied.component';
import { PageNotFoundComponent } from './error-handler/404/page-not-found.component';
import { ErrorComponent } from './error-handler/error/error.component';

import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './components/auth/login/login.component';
import { NoveltiesComponent } from './components/novelties/novelties.component';
import { SearchByNameFormComponent } from './components/search-byname-form/search-byname-form.component';
import { SharedModule } from 'src/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    CoreRoutingModule,
    SharedModule
  ],
  declarations: [
    AccessDeniedComponent,
    PageNotFoundComponent,
    ErrorComponent,

    AuthComponent,
    LoginComponent,

    NoveltiesComponent,
    SearchByNameFormComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
  exports: [
    AuthComponent,
    SearchByNameFormComponent
  ],
})
export class CoreModule { }

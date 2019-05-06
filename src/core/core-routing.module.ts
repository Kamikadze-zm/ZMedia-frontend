import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoveltiesComponent } from './components/novelties/novelties.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AccessDeniedComponent } from './error-handler/403/access-denied.component';
import { PageNotFoundComponent } from './error-handler/404/page-not-found.component';
import { ErrorComponent } from './error-handler/error/error.component';

const routes: Routes = [
  { path: '', component: NoveltiesComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: '403', component: AccessDeniedComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'src/core/guards/auth.guard';
import { OnlineComponent } from './online.component';

const routes: Routes = [
  { path: '', component: OnlineComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlineRoutingModule { }

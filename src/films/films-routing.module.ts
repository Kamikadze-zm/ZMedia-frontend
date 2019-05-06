import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilmsComponent } from './list/films.component';
import { FilmDetailsComponent } from './details/film-details.component';

const routes: Routes = [
  { path: '', component: FilmsComponent },
  { path: ':id', component: FilmDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilmsRoutingModule { }

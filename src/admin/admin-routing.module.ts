import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'src/core/guards/auth.guard';
import { FilmAddComponent } from './components/films/add/film-add.component';
import { FilmEditComponent } from './components/films/edit/film-edit.component';
import { FilmDeleteComponent } from './components/films/delete/film-delete.component';
import { TvSeriesAddComponent } from './components/tv-series/add/tv-series-add.component';
import { TvSeriesEditComponent } from './components/tv-series/edit/tv-series-edit.component';
import { TvSeriesDeleteComponent } from './components/tv-series/delete/tv-series-delete.component';
import { GameAddComponent } from './components/games/add/game-add.component';
import { GameEditComponent } from './components/games/edit/game-edit.component';
import { GameDeleteComponent } from './components/games/delete/game-delete.component';

const routes: Routes = [
  { path: 'films/add', component: FilmAddComponent, canActivate: [AuthGuard], data: { role: 'MODER' } },
  { path: 'films/:id/edit', component: FilmEditComponent, canActivate: [AuthGuard], data: { role: 'MODER' } },
  { path: 'films/:id/delete', component: FilmDeleteComponent, canActivate: [AuthGuard], data: { role: 'MODER' } },
  { path: 'tvseries/add', component: TvSeriesAddComponent, canActivate: [AuthGuard], data: { role: 'MODER' } },
  { path: 'tvseries/:id/edit', component: TvSeriesEditComponent, canActivate: [AuthGuard], data: { role: 'MODER' } },
  { path: 'tvseries/:id/delete', component: TvSeriesDeleteComponent, canActivate: [AuthGuard], data: { role: 'MODER' } },
  { path: 'games/add', component: GameAddComponent, canActivate: [AuthGuard], data: { role: 'MODER' } },
  { path: 'games/:id/edit', component: GameEditComponent, canActivate: [AuthGuard], data: { role: 'MODER' } },
  { path: 'games/:id/delete', component: GameDeleteComponent, canActivate: [AuthGuard], data: { role: 'MODER' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

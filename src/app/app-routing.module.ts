import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from './error-handler/404/page-not-found.component';
import { AccessDeniedComponent } from './error-handler/403/access-denied.component';
import { ErrorComponent } from './error-handler/error/error.component';

import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { RegistrationComponent } from './components/account/registration/registration.component';

import { NoveltiesComponent } from './components/novelties/novelties.component';

import { FilmsComponent } from './components/films/list/films.component';
import { FilmAddComponent } from './components/films/add/film-add.component';
import { FilmDetailsComponent } from './components/films/details/film-details.component';
import { FilmEditComponent } from './components/films/edit/film-edit.component';

import { TvSeriesComponent } from './components/tv-series/list/tv-series.component';
import { TvSeriesDetailsComponent } from './components/tv-series/details/tv-series-details.component';
import { TvSeriesAddComponent } from './components/tv-series/add/tv-series-add.component';
import { TvSeriesEditComponent } from './components/tv-series/edit/tv-series-edit.component';

import { GamesComponent } from './components/games/list/games.component';
import { GameAddComponent } from './components/games/add/game-add.component';
import { GameDetailsComponent } from './components/games/details/game-details.component';
import { GameEditComponent } from './components/games/edit/game-edit.component';
import { SearchComponent } from './components/search/search/search.component';

const routes: Routes = [
    { path: '', component: NoveltiesComponent, pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'registration', component: RegistrationComponent },
    { path: 'films', component: FilmsComponent },
    { path: 'films/add', component: FilmAddComponent, canActivate: [AuthGuard], data: { role: 'MODER' } },
    { path: 'films/:id', component: FilmDetailsComponent },
    { path: 'films/:id/edit', component: FilmEditComponent, canActivate: [AuthGuard], data: { role: 'MODER' } },
    { path: 'tvseries', component: TvSeriesComponent },
    { path: 'tvseries/add', component: TvSeriesAddComponent, canActivate: [AuthGuard], data: { role: 'MODER' } },
    { path: 'tvseries/:id', component: TvSeriesDetailsComponent },
    { path: 'tvseries/:id/edit', component: TvSeriesEditComponent, canActivate: [AuthGuard], data: { role: 'MODER' } },
    { path: 'games', component: GamesComponent },
    { path: 'games/add', component: GameAddComponent, canActivate: [AuthGuard], data: { role: 'MODER' } },
    { path: 'games/:id', component: GameDetailsComponent },
    { path: 'games/:id/edit', component: GameEditComponent, canActivate: [AuthGuard], data: { role: 'MODER' } },
    { path: 'search', component: SearchComponent },
    { path: 'search/:name', component: SearchComponent },
    { path: '403', component: AccessDeniedComponent },
    { path: '404', component: PageNotFoundComponent },
    { path: 'error', component: ErrorComponent },
    { path: '**', redirectTo: '/404' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
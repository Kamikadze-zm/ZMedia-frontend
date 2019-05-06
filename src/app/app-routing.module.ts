import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: 'account', loadChildren: 'src/account/account.module#AccountModule' },
    { path: 'films', loadChildren: 'src/films/films.module#FilmsModule' },
    { path: 'tvseries', loadChildren: 'src/tv-series/tv-series.module#TvSeriesModule' },
    { path: 'games', loadChildren: 'src/games/games.module#GamesModule' },
    { path: 'search', loadChildren: 'src/search/search.module#SearchModule' },
    { path: 'online', loadChildren: 'src/online/online.module#OnlineModule' },
    { path: 'admin', loadChildren: 'src/admin/admin.module#AdminModule' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
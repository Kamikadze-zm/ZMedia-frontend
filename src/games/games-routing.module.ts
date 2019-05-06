import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GamesComponent } from './list/games.component';
import { GameDetailsComponent } from './details/game-details.component';

const routes: Routes = [
  { path: '', component: GamesComponent },
  { path: ':id', component: GameDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesRoutingModule { }

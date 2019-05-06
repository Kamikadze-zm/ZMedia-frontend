import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GamesRoutingModule } from './games-routing.module';
import { PublicationModule } from 'src/publication/publication.module';
import { CommentsModule } from 'src/comments/comments.module';
import { SharedModule } from 'src/shared/shared.module';
import { GameShortDescriptionComponent } from './short-description/game-short-description.component';
import { GamesComponent } from './list/games.component';
import { GameFullDescriptionComponent } from './full-description/game-full-description.component';
import { GameDetailsComponent } from './details/game-details.component';

@NgModule({
  imports: [
    CommonModule,
    GamesRoutingModule,
    PublicationModule,
    CommentsModule,
    SharedModule
  ],
  declarations: [
    GameShortDescriptionComponent,
    GamesComponent,
    GameFullDescriptionComponent,
    GameDetailsComponent
  ],
  exports: [
    GameShortDescriptionComponent,
    GameFullDescriptionComponent
  ]
})
export class GamesModule { }

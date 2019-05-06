import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilmsRoutingModule } from './films-routing.module';
import { PublicationModule } from 'src/publication/publication.module';
import { CommentsModule } from 'src/comments/comments.module';
import { SharedModule } from 'src/shared/shared.module';
import { FilmShortDescriptionComponent } from './short-description/film-short-description.component';
import { FilmsComponent } from './list/films.component';
import { FilmFullDescriptionComponent } from './full-description/film-full-description.component';
import { FilmDetailsComponent } from './details/film-details.component';

@NgModule({
  imports: [
    CommonModule,
    FilmsRoutingModule,
    PublicationModule,
    CommentsModule,
    SharedModule
  ],
  declarations: [
    FilmShortDescriptionComponent,
    FilmsComponent,
    FilmFullDescriptionComponent,
    FilmDetailsComponent
  ],
  exports: [
    FilmShortDescriptionComponent,
    FilmFullDescriptionComponent
  ]
})
export class FilmsModule { }

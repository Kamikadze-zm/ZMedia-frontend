import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { FilmsModule } from 'src/films/films.module';
import { TvSeriesModule } from 'src/tv-series/tv-series.module';
import { GamesModule } from 'src/games/games.module';
import { PublicationModule } from 'src/publication/publication.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SearchRoutingModule,
    PublicationModule,
    FilmsModule,
    TvSeriesModule,
    GamesModule
  ],
  declarations: [
    SearchComponent
  ]
})
export class SearchModule { }

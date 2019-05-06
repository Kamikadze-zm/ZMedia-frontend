import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { FilmsModule } from 'src/films/films.module';
import { TvSeriesModule } from 'src/tv-series/tv-series.module';
import { GamesModule } from 'src/games/games.module';

import { CkEditorComponent } from './ckeditor/ckeditor.component';
import { CkEditorUploadComponent } from './ckeditor/upload/ckeditor-upload.component';
import { PublicationDeleteComponent } from './components/publications/delete/delete.component';
import { FilmFormComponent } from './components/films/form/film-form.component';
import { FilmAddComponent } from './components/films/add/film-add.component';
import { FilmEditComponent } from './components/films/edit/film-edit.component';
import { FilmDeleteComponent } from './components/films/delete/film-delete.component';
import { TvSeriesFormComponent } from './components/tv-series/form/tv-series-form.component';
import { TvSeriesAddComponent } from './components/tv-series/add/tv-series-add.component';
import { TvSeriesEditComponent } from './components/tv-series/edit/tv-series-edit.component';
import { TvSeriesDeleteComponent } from './components/tv-series/delete/tv-series-delete.component';
import { GameFormComponent } from './components/games/form/game-form.component';
import { GameAddComponent } from './components/games/add/game-add.component';
import { GameEditComponent } from './components/games/edit/game-edit.component';
import { GameDeleteComponent } from './components/games/delete/game-delete.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    FilmsModule,
    TvSeriesModule,
    GamesModule
  ],
  declarations: [
    CkEditorComponent,
    CkEditorUploadComponent,

    PublicationDeleteComponent,

    FilmFormComponent,
    FilmAddComponent,
    FilmEditComponent,
    FilmDeleteComponent,

    TvSeriesFormComponent,
    TvSeriesAddComponent,
    TvSeriesEditComponent,
    TvSeriesDeleteComponent,

    GameFormComponent,
    GameAddComponent,
    GameEditComponent,
    GameDeleteComponent
  ]
})
export class AdminModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

import { GlobalErrorHandler } from './error-handler/global-error-handler';
import { AccessDeniedComponent } from './error-handler/403/access-denied.component';
import { PageNotFoundComponent } from './error-handler/404/page-not-found.component';
import { ErrorComponent } from './error-handler/error/error.component';

import { CkEditorComponent } from './ckeditor/ckeditor.component';
import { CkEditorUploadComponent } from './ckeditor/upload/ckeditor-upload.component';

import { AppComponent } from './app.component';

import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegistrationComponent } from './components/account/registration/registration.component';
import { AuthenticatedDirective } from './directives/auth/authenticated.directive';
import { AuthorizedDirective } from './directives/auth/authorized.directive';
import { NotAuthenticatedDirective } from './directives/auth/not-authenticated.directive';

import { NoveltiesComponent } from './components/novelties/novelties.component';

import { PaginationComponent } from './components/pagination/pagination.component';
import { PublicationShortInfoComponent } from './components/publications/short-info/publication-short-info.component';
import { PublicationDetailsInfoComponent } from './components/publications/details-info/publication-details-info.component';
import { PublicationDeleteModalComponent } from './components/publications/delete-modal/publication-delete-modal.component';

import { CommentsComponent } from './components/comments/comments.component';
import { CommentFormComponent } from './components/comments/form/add-comment/comment-form.component';
import { ReplyCommentFormComponent } from './components/comments/form/reply-comment/reply-comment-form.component';
import { DeleteCommentFormComponent } from './components/comments/form/delete-comment/delete-comment-form.component';

import { FilmShortDescriptionComponent } from './components/films/short-description/film-short-description.component';
import { FilmsComponent } from './components/films/list/films.component';
import { FilmFullDescriptionComponent } from './components/films/full-description/film-full-description.component';
import { FilmDetailsComponent } from './components/films/details/film-details.component';
import { FilmFormComponent } from './components/films/form/film-form.component';
import { FilmAddComponent } from './components/films/add/film-add.component';
import { FilmEditComponent } from './components/films/edit/film-edit.component';

import { TvSeriesShortDescriptionComponent } from './components/tv-series/short-description/tv-series-short-description.component';
import { TvSeriesComponent } from './components/tv-series/list/tv-series.component';
import { TvSeriesFullDescriptionComponent } from './components/tv-series/full-description/tv-series-full-description.component';
import { TvSeriesDetailsComponent } from './components/tv-series/details/tv-series-details.component';
import { TvSeriesFormComponent } from './components/tv-series/form/tv-series-form.component';
import { TvSeriesAddComponent } from './components/tv-series/add/tv-series-add.component';
import { TvSeriesEditComponent } from './components/tv-series/edit/tv-series-edit.component';

import { GameShortDescriptionComponent } from './components/games/short-description/game-short-description.component';
import { GamesComponent } from './components/games/list/games.component';
import { GameFullDescriptionComponent } from './components/games/full-description/game-full-description.component';
import { GameDetailsComponent } from './components/games/details/game-details.component';
import { GameFormComponent } from './components/games/form/game-form.component';
import { GameAddComponent } from './components/games/add/game-add.component';
import { GameEditComponent } from './components/games/edit/game-edit.component';

import { SearchByNameFormComponent } from './components/search/byname-form/search-byname-form.component';
import { SearchComponent } from './components/search/search/search.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AppComponent,

    SafeUrlPipe,
    SafeHtmlPipe,

    AccessDeniedComponent,
    PageNotFoundComponent,
    ErrorComponent,

    CkEditorComponent,
    CkEditorUploadComponent,


    AuthComponent,
    LoginComponent,
    RegistrationComponent,
    AuthenticatedDirective,
    AuthorizedDirective,
    NotAuthenticatedDirective,

    NoveltiesComponent,

    PaginationComponent,
    PublicationShortInfoComponent,
    PublicationDetailsInfoComponent,
    PublicationDeleteModalComponent,

    CommentsComponent,
    CommentFormComponent,
    ReplyCommentFormComponent,
    DeleteCommentFormComponent,

    FilmShortDescriptionComponent,
    FilmsComponent,
    FilmFullDescriptionComponent,
    FilmDetailsComponent,
    FilmFormComponent,
    FilmAddComponent,
    FilmEditComponent,

    TvSeriesShortDescriptionComponent,
    TvSeriesComponent,
    TvSeriesFullDescriptionComponent,
    TvSeriesDetailsComponent,
    TvSeriesFormComponent,
    TvSeriesAddComponent,
    TvSeriesEditComponent,

    GameShortDescriptionComponent,
    GamesComponent,
    GameFullDescriptionComponent,
    GameDetailsComponent,
    GameFormComponent,
    GameAddComponent,
    GameEditComponent,

    SearchByNameFormComponent,
    SearchComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
  entryComponents: [ReplyCommentFormComponent, DeleteCommentFormComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TvSeriesRoutingModule } from './tv-series-routing.module';
import { PublicationModule } from 'src/publication/publication.module';
import { CommentsModule } from 'src/comments/comments.module';
import { SharedModule } from 'src/shared/shared.module';
import { TvSeriesShortDescriptionComponent } from './short-description/tv-series-short-description.component';
import { TvSeriesComponent } from './list/tv-series.component';
import { TvSeriesFullDescriptionComponent } from './full-description/tv-series-full-description.component';
import { TvSeriesDetailsComponent } from './details/tv-series-details.component';

@NgModule({
  imports: [
    CommonModule,
    TvSeriesRoutingModule,
    PublicationModule,
    CommentsModule,
    SharedModule
  ],
  declarations: [
    TvSeriesShortDescriptionComponent,
    TvSeriesComponent,
    TvSeriesFullDescriptionComponent,
    TvSeriesDetailsComponent
  ],
  exports: [
    TvSeriesShortDescriptionComponent,
    TvSeriesFullDescriptionComponent
  ]
})
export class TvSeriesModule { }

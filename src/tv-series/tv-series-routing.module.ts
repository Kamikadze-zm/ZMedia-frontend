import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TvSeriesComponent } from './list/tv-series.component';
import { TvSeriesDetailsComponent } from './details/tv-series-details.component';

const routes: Routes = [
  { path: '', component: TvSeriesComponent },
  { path: ':id', component: TvSeriesDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TvSeriesRoutingModule { }

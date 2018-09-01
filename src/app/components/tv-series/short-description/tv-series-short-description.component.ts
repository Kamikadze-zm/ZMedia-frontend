import { Component, Input } from '@angular/core';
import { TvSeriesShortViewDTO } from '../../../model/tv-series';

@Component({
  selector: 'tv-series-short-description',
  templateUrl: './tv-series-short-description.component.html'
})
export class TvSeriesShortDescriptionComponent {
  @Input() tvSeries: TvSeriesShortViewDTO;
}
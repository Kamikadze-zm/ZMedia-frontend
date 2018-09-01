import { Component, Input, AfterViewChecked } from '@angular/core';
import { TvSeriesViewDTO } from '../../../model/tv-series';
import { initSpoiler } from '../../../util/spoiler';
import { processScreenshots } from '../../../util/screenshots';

@Component({
  selector: 'tv-series-full-description',
  templateUrl: './tv-series-full-description.component.html'
})
export class TvSeriesFullDescriptionComponent implements AfterViewChecked {
  @Input() tvSeries: TvSeriesViewDTO;

  private initialized: boolean = false;

  ngAfterViewChecked() {
    if (this.tvSeries && !this.initialized) {
      initSpoiler();
      processScreenshots();
      this.initialized = true;
    }
  }
}
import { Component, Input, AfterViewChecked } from '@angular/core';

import { TvSeriesViewDTO } from '../tv-series';
import { initSpoiler } from 'src/util/spoiler';
import { processScreenshots } from 'src/util/screenshots';

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
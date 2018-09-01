import { Component, Input, AfterViewChecked } from '@angular/core';
import { FilmViewDTO } from '../../../model/film';
import { initSpoiler } from '../../../util/spoiler';
import { processScreenshots } from '../../../util/screenshots';

@Component({
  selector: 'film-full-description',
  templateUrl: './film-full-description.component.html'
})
export class FilmFullDescriptionComponent implements AfterViewChecked {
  @Input() film: FilmViewDTO;

  private initialized: boolean = false;

  ngAfterViewChecked() {
    if (this.film && !this.initialized) {
      initSpoiler();
      processScreenshots();
      this.initialized = true;
    }
  }
}
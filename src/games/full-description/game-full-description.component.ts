import { Component, Input, AfterViewChecked } from '@angular/core';

import { GameViewDTO } from '../game';
import { initSpoiler } from 'src/util/spoiler';
import { processScreenshots } from 'src/util/screenshots';


@Component({
  selector: 'game-full-description',
  templateUrl: './game-full-description.component.html'
})
export class GameFullDescriptionComponent implements AfterViewChecked {

  @Input() game: GameViewDTO;

  private initialized: boolean = false;

  ngAfterViewChecked() {
    if (this.game && !this.initialized) {
      initSpoiler();
      processScreenshots();
      this.initialized = true;
    }
  }
}
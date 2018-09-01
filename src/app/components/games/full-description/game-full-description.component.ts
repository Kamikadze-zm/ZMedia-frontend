import { Component, Input, AfterViewChecked } from '@angular/core';
import { initSpoiler } from '../../../util/spoiler';
import { processScreenshots } from '../../../util/screenshots';
import { GameViewDTO } from '../../../model/game';

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
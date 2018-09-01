import { Component, Input } from '@angular/core';
import { GameShortViewDTO } from '../../../model/game';

@Component({
  selector: 'game-short-description',
  templateUrl: './game-short-description.component.html'
})
export class GameShortDescriptionComponent {
  @Input() game: GameShortViewDTO;
}
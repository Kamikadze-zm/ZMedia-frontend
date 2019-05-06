import { Component, Input } from '@angular/core';

import { FilmShortViewDTO } from '../film';

@Component({
  selector: 'film-short-description',
  templateUrl: './film-short-description.component.html'
})
export class FilmShortDescriptionComponent {
  @Input() film: FilmShortViewDTO;
}
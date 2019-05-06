import { Component, Input } from '@angular/core';

import { PublicationShortViewDTO } from '../publication';

@Component({
  selector: 'publication-short-info',
  templateUrl: './publication-short-info.component.html'
})
export class PublicationShortInfoComponent {

  @Input() p: PublicationShortViewDTO;
  @Input() path: string;

  constructor() { }

}

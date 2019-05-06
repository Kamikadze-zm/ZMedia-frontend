import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';

import { PublicationViewDTO, PublicationType } from '../publication';

@Component({
  selector: 'publication-details-info',
  templateUrl: './publication-details-info.component.html'
})
export class PublicationDetailsInfoComponent {

  @Input() p: PublicationViewDTO;
  @Input() path: PublicationType;
  @Output("onDelete") onDeleteEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private location: Location) { }

  onDelete(): void {
    this.onDeleteEvent.emit();
  }

  back() {
    this.location.back();
  }
}

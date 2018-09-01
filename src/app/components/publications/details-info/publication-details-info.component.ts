import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { PublicationViewDTO } from '../../../model/publication';

@Component({
  selector: 'publication-details-info',
  templateUrl: './publication-details-info.component.html'
})
export class PublicationDetailsInfoComponent {

  @Input() p: PublicationViewDTO;
  @Output("onDelete") onDeleteEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private location: Location) { }

  onDelete(): void {
    this.onDeleteEvent.emit();
  }

  back() {
    this.location.back();
  }
}

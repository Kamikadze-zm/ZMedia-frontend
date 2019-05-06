import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'publication-delete',
  templateUrl: './delete.component.html'
})
export class PublicationDeleteComponent {

  @Input("name") name: string;
  @Output("onDelete") onDeleteEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private location: Location) { }

  delete():void {
    this.onDeleteEvent.emit();
  }

  back() {
    this.location.back();
  }
}

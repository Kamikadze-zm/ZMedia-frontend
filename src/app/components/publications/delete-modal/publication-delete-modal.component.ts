import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'publication-delete-modal',
  templateUrl: './publication-delete-modal.component.html'
})
export class PublicationDeleteModalComponent {

  @Input("header") header: string;
  @Output("onDelete") onDeleteEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("modal") modal: ElementRef;

  constructor() { }

  show() {
    this.modal.nativeElement.className = 'modal fade in';
    this.modal.nativeElement.style.display = 'block';
  }

  hide() {
    this.modal.nativeElement.className = 'modal fade';
    this.modal.nativeElement.style.display = 'none';
  }

  onDelete(): void {
    this.onDeleteEvent.emit();
  }
}

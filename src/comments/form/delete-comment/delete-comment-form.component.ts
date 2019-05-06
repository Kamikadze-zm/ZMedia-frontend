import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'delete-comment-form',
  templateUrl: './delete-comment-form.component.html'
})
export class DeleteCommentFormComponent {

  @Input("commentId") commentId: number;
  @Output("onDelete") onDeleteEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output("onCancel") onCancelEvent: EventEmitter<any> = new EventEmitter<any>();

  commentForm: FormGroup;

  constructor() { }

  onDelete(): void {
    this.onDeleteEvent.emit(this.commentId);
  }

  onCancel(): void {
    this.onCancelEvent.emit();
  }
}
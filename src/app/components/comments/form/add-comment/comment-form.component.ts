import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommentForm } from '../../../../model/comment';

@Component({
  selector: 'comment-form',
  templateUrl: './comment-form.component.html'
})
export class CommentFormComponent implements OnInit, OnChanges {

  @Input("comment") comment: string;
  @Output("onSubmit") onSubmitEvent: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  commentForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.commentForm = CommentForm.create();
  }

  ngOnChanges() {
    if (this.comment) {
      this.commentForm.controls['comment'].setValue(this.comment);
    }
  }

  onSubmit(): void {
    this.onSubmitEvent.emit(this.commentForm);
  }

  isInvalid(controlName: string): boolean {
    const control = this.commentForm.controls[controlName];
    if (!control) {
      return false;
    }
    return (control.dirty || control.touched) && control.invalid;
  }

  isValid(controlName: string): boolean {
    const control = this.commentForm.controls[controlName];
    if (!control) {
      return true;
    }
    return (control.dirty || control.touched) && control.valid;
  }

  getErrors(controlName: string): string[] {
    const control = this.commentForm.controls[controlName];
    if (!control) {
      return null;
    }
    let errors: string[] = [];
    if (control.errors) {
      for (let k in control.errors) {
        errors.push(control.errors[k]);
      }
    }
    return errors;
  }
}
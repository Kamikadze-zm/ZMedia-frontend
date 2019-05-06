import { Component, Input, Output, EventEmitter, OnInit, OnChanges, ElementRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CommentForm } from 'src/comments/comment-form';
import { ReactiveFormComponent } from 'src/core/components/reactive-form-component';

@Component({
  selector: 'reply-comment-form',
  templateUrl: './reply-comment-form.component.html'
})
export class ReplyCommentFormComponent implements OnInit, OnChanges, ReactiveFormComponent {

  @ViewChild("comment") textarea: ElementRef;

  private _comment: string;
  private _parentId: number = null;
  @Output("onSubmit") onSubmitEvent: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output("onCancel") onCancelEvent: EventEmitter<any> = new EventEmitter<any>();

  commentForm: FormGroup;

  constructor() { }

  get comment(): string {
    return this._comment;
  }

  get parentId(): number {
    return this._parentId;
  }

  @Input("comment") set comment(comment: string) {
    let c: string = comment.replace('<cite>', '[quote]')
      .replace('</cite><br/>', '[/quote]')
      .replace('</cite><br>', '[/quote]')
      .replace('<span class="user-name">', '[user]')
      .replace(', </span>', '[/user]');
    if (this._comment !== c) {
      this._comment = c;
      this.ngOnChanges();
    }
  }

  @Input("parentId") set parentId(parentId: number) {
    if (this._parentId !== parentId) {
      this._parentId = parentId;
      this.ngOnChanges();
    }
  }

  ngOnInit() {
    this.commentForm = CommentForm.create();
    this.updateForm();
  }

  ngOnChanges() {
    this.updateForm();
  }

  private updateForm() {
    if (this.commentForm && (this.comment || this.parentId)) {
      this.commentForm.controls['comment'].setValue(this.comment);
      this.commentForm.controls['parentId'].setValue(this.parentId);
    }
  }

  onSubmit(): void {
    this.onSubmitEvent.emit(this.commentForm);
  }

  onCancel(): void {
    this.onCancelEvent.emit();
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
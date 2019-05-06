import { Component, Input, OnChanges, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { plainToClass } from 'class-transformer';

import { PublicationType } from 'src/publication/publication';
import { isValidationError, ValidationError } from 'src/core/model/error';
import { addError } from 'src/core/components/reactive-form-component';
import { CommentService } from './comment.service';
import { CommentViewDTO } from './comment';
import { ReplyCommentFormComponent } from './form/reply-comment/reply-comment-form.component';
import { DeleteCommentFormComponent } from './form/delete-comment/delete-comment-form.component';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  providers: [CommentService]
})
export class CommentsComponent implements OnChanges {

  @Input("publicationId") publicationId: number;
  @Input("publicationType") publicationType: PublicationType;

  comments: CommentViewDTO[];

  private replyForm: ComponentRef<ReplyCommentFormComponent>;
  private replyOnSubmitSub: Subscription;
  private replyOnCancelSub: Subscription;

  private deleteForm: ComponentRef<DeleteCommentFormComponent>;
  private deleteOnDeleteSub: Subscription;
  private deleteOnCancelSub: Subscription;

  private editForm: ComponentRef<ReplyCommentFormComponent>;
  private editOnSubmitSub: Subscription;
  private editOnCancelSub: Subscription;
  private editableComment: HTMLElement;

  constructor(private commentService: CommentService,
    private viewContainer: ViewContainerRef,
    private resolver: ComponentFactoryResolver) { }

  ngOnChanges() {
    if (this.publicationId && this.publicationType) {
      this.loadComments();
    }
  }

  add(commentForm: FormGroup): void {
    this.sendComment(commentForm);
  }

  edit(commentId: number): void {
    const c: CommentViewDTO = this.getComment(commentId);
    if (!c) {
      return;
    }
    let comment: string = c.comment;
    this.createEditForm(commentId, comment);
  }

  reply(parentId: number): void {
    const c: CommentViewDTO = this.getComment(parentId);
    if (!c) {
      return;
    }
    let comment: string = '[user]' + c.authorName + '[/user]';
    this.createReplyForm(parentId, comment);
  }

  quote(parentId: number): void {
    const c: CommentViewDTO = this.getComment(parentId);
    if (!c) {
      return;
    }
    const user: string = '[user]' + c.authorName + '[/user]';
    const quote: string = '[quote]' + c.comment + '[/quote]';
    this.createReplyForm(parentId, quote + user);
  }

  delete(commentId: number): void {
    this.createDeleteForm(commentId);
  }

  realDelete(commentId: number): void {
    this.createDeleteForm(commentId, true);
  }

  private createEditForm(commentId: number, comment: string): void {
    this.destroyForms();
    const factory = this.resolver.resolveComponentFactory(ReplyCommentFormComponent);
    this.editForm = this.viewContainer.createComponent(factory);
    const component = this.editForm.instance;
    component.comment = comment;
    this.editOnSubmitSub = component.onSubmitEvent.subscribe((form: FormGroup) => this.updateComment(commentId, form));
    this.editOnCancelSub = component.onCancelEvent.subscribe(() => this.destroyEditForm());
    const parentElement = document.getElementById('item' + commentId);
    this.editableComment = parentElement.firstElementChild as HTMLElement;
    this.editableComment.style.display = 'none';
    const componentElement: HTMLElement = this.editForm.location.nativeElement as HTMLElement;
    parentElement.appendChild(componentElement);
    (component.textarea.nativeElement as HTMLElement).focus();
  }

  private createReplyForm(parentId: number, comment: string): void {
    this.destroyForms();
    const factory = this.resolver.resolveComponentFactory(ReplyCommentFormComponent);
    this.replyForm = this.viewContainer.createComponent(factory);
    const component = this.replyForm.instance;
    component.parentId = parentId;
    component.comment = comment;
    this.replyOnSubmitSub = component.onSubmitEvent.subscribe((form: FormGroup) => this.sendComment(form));
    this.replyOnCancelSub = component.onCancelEvent.subscribe(() => this.destroyReplyForm());
    const parentElement = document.getElementById('item' + parentId);
    const componentElement: HTMLElement = this.replyForm.location.nativeElement as HTMLElement;
    parentElement.appendChild(componentElement);
    (component.textarea.nativeElement as HTMLElement).focus();
  }

  private destroyEditForm(): void {
    if (this.editForm) {
      if (this.editOnSubmitSub) {
        this.editOnSubmitSub.unsubscribe();
        this.editOnSubmitSub = null;
      }
      if (this.editOnCancelSub) {
        this.editOnCancelSub.unsubscribe();
        this.editOnCancelSub = null;
      }
      if (this.editableComment) {
        this.editableComment.removeAttribute('style');
      }
      this.editForm.destroy();
    }
  }

  private destroyReplyForm(): void {
    if (this.replyForm) {
      if (this.replyOnSubmitSub) {
        this.replyOnSubmitSub.unsubscribe();
        this.replyOnSubmitSub = null;
      }
      if (this.replyOnCancelSub) {
        this.replyOnCancelSub.unsubscribe();
        this.replyOnCancelSub = null;
      }
      this.replyForm.destroy();
    }
  }

  private createDeleteForm(commentId: number, realDelete?: boolean): void {
    this.destroyForms();
    const factory = this.resolver.resolveComponentFactory(DeleteCommentFormComponent);
    this.deleteForm = this.viewContainer.createComponent(factory);
    const component = this.deleteForm.instance;
    component.commentId = commentId;
    if (!realDelete) {
      this.replyOnSubmitSub = component.onDeleteEvent.subscribe((id: number) => this.deleteComment(id));
    } else {
      this.replyOnSubmitSub = component.onDeleteEvent.subscribe((id: number) => this.realDeleteComment(id));
    }
    this.replyOnCancelSub = component.onCancelEvent.subscribe(() => this.destroyDeleteForm());
    const parentElement = document.getElementById('item' + commentId);
    const componentElement: HTMLElement = this.deleteForm.location.nativeElement as HTMLElement;
    parentElement.appendChild(componentElement);
  }

  private destroyDeleteForm(): void {
    if (this.deleteForm) {
      if (this.deleteOnDeleteSub) {
        this.deleteOnDeleteSub.unsubscribe();
        this.deleteOnDeleteSub = null;
      }
      if (this.deleteOnCancelSub) {
        this.deleteOnCancelSub.unsubscribe();
        this.deleteOnCancelSub = null;
      }
      this.deleteForm.destroy();
    }
  }

  private destroyForms(): void {
    this.destroyEditForm();
    this.destroyReplyForm();
    this.destroyDeleteForm();
  }

  private sendComment(form: FormGroup): void {
    if (form.valid) {
      this.commentService.add(form.value, this.publicationType, this.publicationId).subscribe(
        () => {
          const comment: AbstractControl = form.controls['comment'];
          comment.setValue(null);
          comment.markAsUntouched();
          comment.markAsPristine();
          this.loadComments();
        },
        (err) => {
          if (isValidationError(err)) {
            const ve: ValidationError = err.error as ValidationError;
            if (ve.fieldErrors) {
              ve.fieldErrors.forEach(e => {
                addError(form.controls[e.field], "server", e.message);
              });
            }
          } else {
            throw err;
          }
        });
    }
  }

  private updateComment(commentId: number, form: FormGroup): void {
    if (commentId && form.valid) {
      this.commentService.update(commentId, form.value, this.publicationType).subscribe(
        () => { this.loadComments() },
        (err) => {
          if (isValidationError(err)) {
            const ve: ValidationError = err.error as ValidationError;
            if (ve.fieldErrors) {
              ve.fieldErrors.forEach(e => {
                addError(form.controls[e.field], "server", e.message);
              });
            }
          } else {
            throw err;
          }
        });
    }
  }

  private deleteComment(commentId: number): void {
    if (commentId) {
      this.commentService.deleteById(commentId, this.publicationType).subscribe(() => this.loadComments())
    }
  }

  private realDeleteComment(commentId: number): void {
    if (commentId) {
      this.commentService.realDelete(commentId, this.publicationType).subscribe(() => this.loadComments())
    }
  }

  private loadComments(): void {
    this.commentService.getCommentsForPublication(this.publicationType, this.publicationId).subscribe(
      (comments: CommentViewDTO[]) => {
        this.comments = plainToClass(CommentViewDTO, comments);
      });
  }

  private getComment(id: number): CommentViewDTO {
    if (!id) {
      return null;
    }
    return this.comments.find(c => c.id === id);
  }
}
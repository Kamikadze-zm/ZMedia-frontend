import { Component, Input, OnChanges, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { CommentViewDTO } from '../../model/comment';
import { PublicationType } from '../../model/publication';
import { plainToClass } from '../../../../node_modules/class-transformer';
import { FormGroup, AbstractControl } from '@angular/forms';
import { isValidationError, ValidationError } from '../../model/error';
import { CustomValidators } from '../../validators/custom-validators';
import { ReplyCommentFormComponent } from './form/reply-comment/reply-comment-form.component';
import { Subscription } from 'rxjs';
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

  // function edit(commentId) {
  //   var parentElement = document.getElementById('item' + commentId);
  //   var comm = parentElement.getElementsByClassName('comment')[0].innerHTML;
  //   comm = comm.replace('<cite>', '[quote]')
  //     .replace('</cite><br/>', '[/quote]')
  //     .replace('</cite><br>', '[/quote]')
  //     .replace('<span class="user-name">', '[user]')
  //     .replace(', </span>', '[/user]');
  //   parentElement.getElementsByClassName('comment-info')[0].style.display = 'none';
  //   parentElement.getElementsByClassName('comment')[0].style.display = 'none';
  //   parentElement.getElementsByClassName('comment-actions')[0].style.display = 'none';
  //   createForm(editFormId, commentId, parentElement, null, null, comm);
  //   formEditExist = true;
  // }

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
                CustomValidators.addError(form.controls[e.field], "server", e.message);
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
                CustomValidators.addError(form.controls[e.field], "server", e.message);
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

// var materialType = '';
// var materialId = 0;
// var replyFormId = 'replyCommentForm';
// var editFormId = 'editCommentForm';
// var deleteFormId = 'deleteCommentForm';
// var formReplyExist = false;
// var formEditExist = false;
// var formDeleteExist = false;

// function getComments() {
//   var xmlhttp = new XMLHttpRequest();
//   xmlhttp.open('Get', '/' + materialType + 'comments/getcomments/' + materialId, true);
//   xmlhttp.onreadystatechange = function () {
//     if (xmlhttp.readyState == 4) {
//       var response = xmlhttp.responseText;
//       if (xmlhttp.status != 200) {
//         alert('Произошла ошибка загрузки комментариев');
//       } else {
//         var commentsBlock = document.getElementsByClassName('comments')[0];
//         commentsBlock.innerHTML = response;
//       }
//     }
//   };
//   xmlhttp.send(null);
// }

// function sendComment(formId, actionType, commentId) {
//   var form = document.getElementById(formId);
//   var url;
//   var fd = new FormData();
//   switch (actionType) {
//     case 'add':
//     case 'reply':
//       url = '/' + materialType + 'comments/add';
//       fd.append("materialId", materialId);
//       fd.append("comment", form.elements.comment.value);
//       fd.append("parentId", form.elements.parentId.value);
//       break;
//     case 'edit':
//       url = '/' + materialType + 'comments/edit/' + commentId;
//       fd.append("comment", form.elements.comment.value);
//       break;
//     case 'delete':
//       url = '/' + materialType + 'comments/delete/' + commentId;
//       fd = null;
//       break;
//     case 'fulldelete':
//       url = '/' + materialType + 'comments/fulldelete/' + commentId;
//       fd = null;
//       break;
//   }
//   var xmlhttp = new XMLHttpRequest();
//   xmlhttp.open('POST', url, true);
//   xmlhttp.onreadystatechange = function () {
//     if (xmlhttp.readyState == 4) {
//       var response = xmlhttp.responseText;
//       if (xmlhttp.status != 200) {
//         alert('Произошла ошибка отправки комментария, повторите попытку.');
//       } else {
//         if (response === 'true') {
//           getComments();
//           formReplyExist = false;
//           formEditExist = false;
//           formDeleteExist = false;
//         } else {
//           alert('Комментарий не прошел проверку.');
//         }
//       }
//     }
//   };
//   xmlhttp.send(fd);
// }

// function reply(parentId) {
//   var parentElement = document.getElementById('item' + parentId);
//   var userName = parentElement.getElementsByClassName('comment-author')[0].textContent;
//   createForm(replyFormId, parentId, parentElement, userName, null, null);
//   formReplyExist = true;
// }

// function quote(parentId) {
//   var parentElement = document.getElementById('item' + parentId);
//   var userName = parentElement.getElementsByClassName('comment-author')[0].textContent;
//   var quote = parentElement.getElementsByClassName('comment')[0].lastChild.nodeValue.trim();
//   createForm(replyFormId, parentId, parentElement, userName, quote, null);
//   formReplyExist = true;
// }

// function edit(commentId) {
//   var parentElement = document.getElementById('item' + commentId);
//   var comm = parentElement.getElementsByClassName('comment')[0].innerHTML;
//   comm = comm.replace('<cite>', '[quote]')
//     .replace('</cite><br/>', '[/quote]')
//     .replace('</cite><br>', '[/quote]')
//     .replace('<span class="user-name">', '[user]')
//     .replace(', </span>', '[/user]');
//   parentElement.getElementsByClassName('comment-info')[0].style.display = 'none';
//   parentElement.getElementsByClassName('comment')[0].style.display = 'none';
//   parentElement.getElementsByClassName('comment-actions')[0].style.display = 'none';
//   createForm(editFormId, commentId, parentElement, null, null, comm);
//   formEditExist = true;
// }

// function deleteC(commentId) {
//   var parentElement = document.getElementById('item' + commentId);
//   createDeleteForm('delete', parentElement, commentId);
//   formDeleteExist = true;
// }

// function fullDelete(commentId) {
//   var parentElement = document.getElementById('item' + commentId);
//   createDeleteForm('fulldelete', parentElement, commentId);
//   formDeleteExist = true;
// }

// function createForm(formId, commentId, parentElement, userName, quote, editComm) {
//   cancelComment();
//   var form = document.createElement('FORM');
//   form.setAttribute('id', formId);
//   form.setAttribute('method', 'post');
//   var parentIdInput = document.createElement('INPUT');
//   parentIdInput.setAttribute('type', 'hidden');
//   parentIdInput.setAttribute('name', 'parentId');
//   if (editComm == null) {
//     parentIdInput.setAttribute('value', commentId);
//   }
//   var labelComment = document.createElement('LABEL');
//   labelComment.setAttribute('for', 'comment');
//   labelComment.innerHTML = 'Комментарий:';
//   var brAfterLabel = document.createElement('BR');
//   var textareaComment = document.createElement('TEXTAREA');
//   textareaComment.setAttribute('name', 'comment');
//   var comment = "";
//   if (editComm != null) {
//     comment += editComm;
//   } else {
//     if (quote != null) {
//       comment += '[quote]' + quote + '[/quote]';
//     }
//     comment += '[user]' + userName + '[/user]';
//   }
//   textareaComment.innerHTML = comment;
//   var brAfterTextArea = document.createElement('BR');
//   var submit = document.createElement('INPUT');
//   var actionType;
//   if (editComm != null) {
//     actionType = 'edit';
//   } else {
//     actionType = 'reply';
//   }
//   submit.setAttribute('type', 'button');
//   submit.setAttribute('onclick', 'sendComment("' + formId + '", "' + actionType + '", ' + commentId + ')');
//   submit.setAttribute('value', 'Комментировать');
//   var cancel = document.createElement('INPUT');
//   cancel.setAttribute('type', 'button');
//   cancel.setAttribute('onclick', 'cancelComment()');
//   cancel.setAttribute('value', 'Отмена');
//   form.appendChild(parentIdInput);
//   form.appendChild(labelComment);
//   form.appendChild(brAfterLabel);
//   form.appendChild(textareaComment);
//   form.appendChild(brAfterTextArea);
//   form.appendChild(submit);
//   form.appendChild(cancel);
//   parentElement.appendChild(form);
// }

// function createDeleteForm(action, parentElement, commentId) {
//   cancelComment();
//   var form = document.createElement('FORM');
//   form.setAttribute('id', deleteFormId);
//   form.setAttribute('method', 'post');
//   var submit = document.createElement('INPUT');
//   submit.setAttribute('type', 'button');
//   submit.setAttribute('onclick', 'sendComment("' + deleteFormId + '", "' + action + '", ' + commentId + ')');
//   submit.setAttribute('value', 'Удалить');
//   var cancel = document.createElement('INPUT');
//   cancel.setAttribute('type', 'button');
//   cancel.setAttribute('onclick', 'cancelComment()');
//   cancel.setAttribute('value', 'Отмена');
//   form.appendChild(submit);
//   form.appendChild(cancel);
//   parentElement.appendChild(form);
// }

// function cancelComment() {
//   if (formReplyExist) {
//     var replyForm = document.getElementById(replyFormId);
//     replyForm.parentNode.removeChild(replyForm);
//     formReplyExist = false;
//   }
//   if (formEditExist) {
//     var editForm = document.getElementById(editFormId);
//     var item = editForm.parentNode;
//     item.getElementsByClassName('comment-info')[0].style.display = 'block';
//     item.getElementsByClassName('comment')[0].style.display = 'block';
//     item.getElementsByClassName('comment-actions')[0].style.display = 'block';
//     item.removeChild(editForm);
//     formEditExist = false;
//   }
//   if (formDeleteExist) {
//     var deleteForm = document.getElementById(deleteFormId);
//     deleteForm.parentNode.removeChild(deleteForm);
//     formDeleteExist = false;
//   }
// }

// function comments(type, id) {
//   this.materialType = type;
//   this.materialId = id;
// }
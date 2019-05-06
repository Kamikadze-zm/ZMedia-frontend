import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/shared/shared.module';
import { CommentsComponent } from './comments.component';
import { CommentFormComponent } from './form/add-comment/comment-form.component';
import { ReplyCommentFormComponent } from './form/reply-comment/reply-comment-form.component';
import { DeleteCommentFormComponent } from './form/delete-comment/delete-comment-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    CommentsComponent,
    CommentFormComponent,
    ReplyCommentFormComponent,
    DeleteCommentFormComponent
  ],
  entryComponents: [
    ReplyCommentFormComponent,
    DeleteCommentFormComponent
  ],
  exports: [CommentsComponent]
})
export class CommentsModule { }

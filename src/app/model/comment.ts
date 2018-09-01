import { formatDate } from "../util/date-util";
import { FormGroup, FormControl } from "@angular/forms";
import { CustomValidators } from "../validators/custom-validators";

export class CommentViewDTO {

    constructor(
        public id: number,
        public level: number,
        public comment: string,
        public status: string,
        public commentDate: number,
        public changedDate: number,
        public authorName: string,
        public authorAvatar: string) { }

    public get formattedCommentDate(): string {
        return formatDate(this.commentDate);
    }

    public get formattedChangedDate(): string {
        return formatDate(this.changedDate);
    }

    public get normilizedLevel(): string {
        if (this.level === 0) {
            return '';
        } else if (this.level > 4) {
            return '4';
        } else {
            return this.level.toString();
        }
    }

    public get statusMessage(): string {
        switch (this.status) {
            case 'CBM':
                return 'Комментарий изменен модератором';
            case 'CBU':
                return 'Комментарий изменен автором';
            case 'DBM':
                return 'Комментарий удален модератором';
            case 'DBU':
                return 'Комментарий удален автором';
            default:
                return '';
        }
    }

    public isDeleted(): boolean {
        return this.status == 'DBM' || this.status == 'DBU';
    }
}

export class CommentDTO {
    constructor(
        public comment: string,
        public parentId: number) { }
}

export class CommentForm {

    public static create(comment: string = null, parentId: number = null): FormGroup {
        return new FormGroup({
            comment: new FormControl(comment,
                [CustomValidators.required("Введите текст комментария"),
                CustomValidators.size(null, 10000, "Комментарий должен содержать не более 10000 символов")]),
            parentId: new FormControl(parentId)
        });
    }
}
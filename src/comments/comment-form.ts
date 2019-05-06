import { FormGroup, FormControl } from "@angular/forms";
import { CustomValidators } from "src/validators/custom-validators";

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
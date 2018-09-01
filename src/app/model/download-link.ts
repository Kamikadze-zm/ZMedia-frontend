import { FormGroup, FormControl } from "@angular/forms";
import { CustomValidators } from "../validators/custom-validators";

export class DownloadLinkDTO {
    constructor(public description: string, public link: string) {
    }
}

export class DownloadLinkForm {

    public static create(description: string, link: string): FormGroup {
        return new FormGroup({
            description: new FormControl(description,
                CustomValidators.size(null, 300, "Описание ссылки должно содержать не более 300 символов")),
            link: new FormControl(link,
                [CustomValidators.required("Укажите ссылку"),
                CustomValidators.size(null, 750, "Ссылка должна содержать не более 750 символов")])
        });
    }
}
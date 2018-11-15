import { FormGroup, FormArray, AbstractControl } from "@angular/forms";
import { ValidationError } from "../model/error";

export function markTouched(group: FormGroup | FormArray) {
    Object.keys(group.controls).forEach((k: string) => {
        const control: AbstractControl = group.controls[k];
        control.markAsTouched();
        if (control instanceof FormGroup || control instanceof FormArray) {
            markTouched(control);
        }
    });
}

export function isInvalid(fg: FormGroup, path: string | (string | number)[]): boolean {
    const control = fg.get(path);
    if (!control) {
        return false;
    }
    return control.touched && control.invalid;
}

export function isValid(fg: FormGroup, path: string | (string | number)[]): boolean {
    const control = fg.get(path);
    if (!control) {
        return true;
    }
    return control.touched && !control.pending && control.valid;
}

export function getErrors(fg: FormGroup, path: string | (string | number)[]): string[] {
    const control = fg.get(path);
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

export function addValidationErrors(fg: FormGroup, ve: ValidationError, hasArrays: boolean): void {
    if (ve.fieldErrors) {
        ve.fieldErrors.forEach(e => {
            let field: string = e.field;
            if (hasArrays) {
                field.replace('[', '.').replace(']', '');
            }
            addError(fg.get(field), "server", e.message);
        });
    }
}

export function addError(control: AbstractControl, errorName: string, errorMessage: string): void {
    if (!control) {
        return;
    }
    let error: string = control.getError(errorName);
    if (error) {
        error += `, ${errorMessage}`;
    } else {
        control.setErrors({
            [errorName]: errorMessage
        })
    }
}
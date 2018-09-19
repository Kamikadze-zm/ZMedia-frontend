import { FormGroup, FormArray, AbstractControl } from "@angular/forms";

export function markTouched(group: FormGroup | FormArray) {
    Object.keys(group.controls).forEach((k: string) => {
        const control: AbstractControl = group.controls[k];
        control.markAsTouched();
        if (control instanceof FormGroup || control instanceof FormArray) {
            markTouched(control);
        }
    });
}
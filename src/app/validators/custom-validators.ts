import { ValidatorFn, AbstractControl, FormArray } from "@angular/forms";

export function isEmptyValue(value: any): boolean {
    return value == null || value.length === 0;
}

const EMAIL_REGEXP = /\S+@\S+\.\S+/;
const USERNAME_REGEXP = /^[a-zA-Z][a-zA-Z0-9_\-.]+$/;
const NAN_MESSAGE = "Введите число";

export class CustomValidators {

    public static required(message: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            const value = control.value;
            if (isEmptyValue(value) || this.isEmptyFormArray(control)) {
                return { required: message };
            }
            return null;
        };
    }

    public static email(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            const value = control.value;
            if (isEmptyValue(value) || EMAIL_REGEXP.test(value)) {
                return null;
            }
            return { email: "Некорректный email" };
        };
    }

    public static username(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            const value = control.value;
            if (isEmptyValue(value) || USERNAME_REGEXP.test(value)) {
                return null;
            }
            return { username: "Имя пользователя должно состоять из латинских букв, цифр, символов '_', '-', '.' и начинаться с буквы" };
        };
    }

    public static size(min: number, max: number, message: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            const value = control.value;
            if (isEmptyValue(value)) {
                return null;
            }
            let length: number;
            if (control instanceof FormArray) {
                length = control.length;
            } else {
                length = control.value.length;
            }
            if ((min && max && (length < min || length > max))
                || (min && length < min)
                || (max && length > max)) {
                return { size: message };
            }
            return null;
        };
    }

    public static min(min: number, message: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (isEmptyValue(control.value)) {
                return null;
            }
            const value = parseFloat(control.value);
            if (isNaN(value)) {
                return { min: NAN_MESSAGE };
            }
            if (value < min) {
                return { min: message };
            }
            return null;
        };
    }

    public static max(max: number, message: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (isEmptyValue(control.value)) {
                return null;
            }
            const value = parseFloat(control.value);
            if (isNaN(value)) {
                return { max: NAN_MESSAGE };
            }
            if (value > max) {
                return { max: message };
            }
            return null;
        };
    }

    public static addError(control: AbstractControl, errorName: string, errorMessage: string) {
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

    private static isEmptyFormArray(c: AbstractControl): boolean {
        if (c instanceof FormArray && c.length === 0) {
            return true;
        }
        return false;
    }
}
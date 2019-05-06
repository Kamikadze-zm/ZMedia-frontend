export class Error {
    constructor(
        public errorCode: number,
        public message: string,
        public details: string) { }
}

export class ValidationError extends Error {
    constructor(
        errorCode: number,
        message: string,
        details: string,
        public objectErrors: ValidationObjectError[],
        public fieldErrors: ValidationFieldError[]
    ) {
        super(errorCode, message, details);
    }
}

export class ValidationObjectError {
    constructor(
        public object: string,
        public message: string
    ) { }
}

export class ValidationFieldError extends ValidationObjectError {
    constructor(
        object: string,
        message: string,
        public field: string,
        public rejectedValue: string
    ) {
        super(object, message);
    }
}

export function isApiError(error: any): boolean {
    return error && error.status == 400 && error.error;
}

export function isMessageError(error: any): boolean {
    return isApiError(error) && error.error.errorCode == 0;
}

export function isValidationError(error: any): boolean {
    return isApiError(error) && error.error.errorCode == 1;
}

export function isVerificationCodeError(error: any): boolean {
    return isApiError(error) && error.error.errorCode == 2;
}
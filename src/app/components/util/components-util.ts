export interface ReactiveFormComponent {

    isInvalid(path: string | (string | number)[]): boolean;

    isValid(path: string | (string | number)[]): boolean;

    getErrors(path: string | (string | number)[]): string[];
}
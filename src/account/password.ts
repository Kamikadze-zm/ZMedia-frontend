export class NewPasswordDTO {
    constructor(
        public password: string,
        public confirmPassword: string) {
    }
}
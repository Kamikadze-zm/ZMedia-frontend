export class RegistrationDTO {
    constructor(
        public email: string,
        public name: string,
        public password: string,
        public confirmPassword: string) {
    }
}
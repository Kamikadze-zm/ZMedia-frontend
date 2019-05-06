export class User {
    constructor(public email: string,
        public name: string,
        public role: Role,
        public avatar: string,
        public confirmed: boolean) {
    }

    public hasRole(role: Role): boolean {
        switch (role) {
            case Role.ADMIN:
                return this.isAdmin();
            case Role.MODER:
                return this.isModer();
            case Role.UPLOADER:
                return this.isUploader();
            default:
                return false;
        }
    }

    public hasStringRole(role: string): boolean {
        const enumRole: Role = Role[role.toUpperCase()];
        return this.hasRole(enumRole);
    }

    public isAdmin(): boolean {
        return Role.ADMIN === this.role;
    }

    public isModer(): boolean {
        return Role.MODER === this.role || Role.ADMIN === this.role;
    }

    public isUploader(): boolean {
        return Role.UPLOADER === this.role || Role.ADMIN === this.role;
    }
}

export enum Role {
    ADMIN,
    MODER,
    UPLOADER
}
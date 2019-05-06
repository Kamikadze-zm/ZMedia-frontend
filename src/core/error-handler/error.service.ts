import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ErrorService {
    private errors: any[] = [];

    push(error: any) {
        this.errors.push(error);
    }

    pop(): any {
        let err = this.errors.pop()
        return err;
    }
}
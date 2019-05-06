import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material";

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {

    private config: MatSnackBarConfig;

    constructor(private snackBar: MatSnackBar) {
        const config = new MatSnackBarConfig();
        config.verticalPosition = 'top';
        config.horizontalPosition = 'center';
        config.duration = 7500;
        this.config = config;
    }

    public show(message: string) {
        this.snackBar.open(message, undefined, this.config);
    }
}
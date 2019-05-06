import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormArray } from '@angular/forms';

import { isValidationError, ValidationError } from 'src/core/model/error';
import { addError, markTouched } from 'src/core/components/reactive-form-component';
import { PublicationType } from 'src/publication/publication';
import { AdminGameService } from 'src/admin/services/admin-game.service';

@Component({
  selector: 'app-game-add',
  templateUrl: './game-add.component.html',
  providers: [AdminGameService]
})
export class GameAddComponent {

  constructor(private adminGameService: AdminGameService, private router: Router) { }

  add(event: FormGroup): void {
    if (event.valid) {
      this.adminGameService.add(event.value).subscribe(
        (id: number) => { this.router.navigate([`/${PublicationType.GAME}`, id]) },
        (err) => {
          if (isValidationError(err)) {
            this.markTouched(event);
            const ve: ValidationError = err.error as ValidationError;
            if (ve.fieldErrors) {
              ve.fieldErrors.forEach(e => {
                addError(event.get(e.field.replace('[', '.').replace(']', '')), "server", e.message);
              });
            }
          } else {
            throw err;
          }
        });
    } else {
      this.markTouched(event);
    }
  }

  private markTouched(group: FormGroup | FormArray) {
    markTouched(group);
  }
}
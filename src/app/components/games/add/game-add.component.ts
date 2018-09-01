import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { isValidationError, ValidationError } from '../../../model/error';
import { CustomValidators } from '../../../validators/custom-validators';
import { PublicationType } from '../../../model/publication';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-game-add',
  templateUrl: './game-add.component.html',
  providers: [GameService]
})
export class GameAddComponent {

  constructor(private gameService: GameService, private router: Router) { }

  add(event: FormGroup): void {
    if (event.valid) {
      this.gameService.add(event.value).subscribe(
        (id: number) => { this.router.navigate([`/${PublicationType.GAME}`, id]) },
        (err) => {
          if (isValidationError(err)) {
            this.markTouched(event);
            const ve: ValidationError = err.error as ValidationError;
            if (ve.fieldErrors) {
              ve.fieldErrors.forEach(e => {
                CustomValidators.addError(event.get(e.field.replace('[', '.').replace(']', '')), "server", e.message);
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
    Object.keys(group.controls).forEach((k: string) => {
      const control: AbstractControl = group.controls[k];
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
}
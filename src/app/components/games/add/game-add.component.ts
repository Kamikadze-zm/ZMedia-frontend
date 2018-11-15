import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormArray } from '@angular/forms';
import { isValidationError, ValidationError } from '../../../model/error';
import { PublicationType } from '../../../model/publication';
import { GameService } from '../../../services/game.service';
import { markTouched, addError } from '../../../util/forms-util';

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
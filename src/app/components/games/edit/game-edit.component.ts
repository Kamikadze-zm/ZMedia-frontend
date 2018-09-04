import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { isValidationError, ValidationError } from '../../../model/error';
import { CustomValidators } from '../../../validators/custom-validators';
import { Subscription } from 'rxjs';
import { PublicationType } from '../../../model/publication';
import { GameService } from '../../../services/game.service';
import { GameViewDTO } from '../../../model/game';
import { plainToClass } from 'class-transformer';

@Component({
  selector: 'app-game-edit',
  templateUrl: './game-edit.component.html',
  providers: [GameService]
})
export class GameEditComponent implements OnInit, OnDestroy {

  game: GameViewDTO;
  private id: number;

  private paramsSub: Subscription;

  constructor(private gameService: GameService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.gameService.getById(this.id).subscribe((game: GameViewDTO) => {
        this.game = plainToClass(GameViewDTO, game);
      });
    });
  }

  edit(event: FormGroup): void {
    if (event.valid) {
      this.gameService.update(this.id, event.value).subscribe(
        () => { this.router.navigate([`/${PublicationType.GAME}`, this.id]) },
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

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }
}
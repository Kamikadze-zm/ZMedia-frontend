import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { plainToClass } from 'class-transformer';

import { PublicationType } from 'src/publication/publication';
import { isValidationError, ValidationError } from 'src/core/model/error';
import { addError, markTouched } from 'src/core/components/reactive-form-component';
import { GameService } from 'src/games/game.service';
import { GameViewDTO } from 'src/games/game';
import { AdminGameService } from 'src/admin/services/admin-game.service';

@Component({
  selector: 'app-game-edit',
  templateUrl: './game-edit.component.html',
  providers: [GameService, AdminGameService]
})
export class GameEditComponent implements OnInit, OnDestroy {

  game: GameViewDTO;
  private id: number;

  private paramsSub: Subscription;

  constructor(private adminGameService: AdminGameService,
    private gameService: GameService,
    private router: Router,
    private route: ActivatedRoute) { }

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
      this.adminGameService.update(this.id, event.value).subscribe(
        () => { this.router.navigate([`/${PublicationType.GAME}`, this.id]) },
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

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }

  private markTouched(group: FormGroup | FormArray) {
    markTouched(group);
  }
}
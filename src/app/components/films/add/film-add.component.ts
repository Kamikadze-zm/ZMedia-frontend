import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormArray } from '@angular/forms';
import { FilmService } from '../../../services/film.service';
import { isValidationError, ValidationError } from '../../../model/error';
import { CustomValidators } from '../../../validators/custom-validators';
import { PublicationType } from '../../../model/publication';
import { FilmViewDTO } from '../../../model/film';
import { plainToClass } from 'class-transformer';
import { markTouched } from '../../../util/forms-util';

@Component({
  selector: 'app-film-add',
  templateUrl: './film-add.component.html',
  providers: [FilmService]
})
export class FilmAddComponent {

  from: number;
  film: FilmViewDTO;

  constructor(private filmService: FilmService, private router: Router) { }

  addFilm(event: FormGroup): void {
    if (event.valid) {
      this.filmService.add(event.value).subscribe(
        (id: number) => { this.router.navigate([`/${PublicationType.FILM}`, id]) },
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
    markTouched(group);
  }

  fill(): void {
    if (this.from) {
      this.filmService.getById(this.from).subscribe((film: FilmViewDTO) => {
        this.film = plainToClass(FilmViewDTO, film);
      });
    }
  }
}
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormArray } from '@angular/forms';
import { plainToClass } from 'class-transformer';

import { PublicationType } from 'src/publication/publication';
import { isValidationError, ValidationError } from 'src/core/model/error';
import { addError, markTouched } from 'src/core/components/reactive-form-component';
import { FilmViewDTO } from 'src/films/film';
import { FilmService } from 'src/films/film.service';
import { AdminFilmService } from 'src/admin/services/admin-film.service';

@Component({
  selector: 'app-film-add',
  templateUrl: './film-add.component.html',
  providers: [AdminFilmService, FilmService]
})
export class FilmAddComponent {

  from: number;
  film: FilmViewDTO;

  constructor(private adminFilmService: AdminFilmService,
    private filmService: FilmService,
    private router: Router) { }

  addFilm(event: FormGroup): void {
    if (event.valid) {
      this.adminFilmService.add(event.value).subscribe(
        (id: number) => { this.router.navigate([`/${PublicationType.FILM}`, id]) },
        (err: any) => {
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

  fill(): void {
    if (this.from) {
      this.filmService.getById(this.from).subscribe((film: FilmViewDTO) => {
        this.film = plainToClass(FilmViewDTO, film);
      });
    }
  }
}
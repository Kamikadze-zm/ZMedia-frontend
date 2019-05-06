import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { plainToClass } from 'class-transformer';

import { PublicationType } from 'src/publication/publication';
import { isValidationError, ValidationError } from 'src/core/model/error';
import { addError, markTouched } from 'src/core/components/reactive-form-component';
import { FilmViewDTO } from 'src/films/film';
import { FilmService } from 'src/films/film.service';
import { AdminFilmService } from 'src/admin/services/admin-film.service';

@Component({
  selector: 'app-film-edit',
  templateUrl: './film-edit.component.html',
  providers: [AdminFilmService, FilmService]
})
export class FilmEditComponent implements OnInit, OnDestroy {

  film: FilmViewDTO;
  private id: number;

  private paramsSub: Subscription;

  constructor(private adminFilmService: AdminFilmService,
    private filmService: FilmService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.filmService.getById(this.id).subscribe((film: FilmViewDTO) => {
        this.film = plainToClass(FilmViewDTO, film);
      });
    });
  }

  editFilm(event: FormGroup): void {
    if (event.valid) {
      this.adminFilmService.update(this.id, event.value).subscribe(
        () => { this.router.navigate([`/${PublicationType.FILM}`, this.id]) },
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
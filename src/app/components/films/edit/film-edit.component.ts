import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray } from '@angular/forms';
import { FilmService } from '../../../services/film.service';
import { isValidationError, ValidationError } from '../../../model/error';
import { Subscription } from 'rxjs';
import { FilmViewDTO } from '../../../model/film';
import { PublicationType } from '../../../model/publication';
import { plainToClass } from 'class-transformer';
import { markTouched, addError } from '../../../util/forms-util';

@Component({
  selector: 'app-film-edit',
  templateUrl: './film-edit.component.html',
  providers: [FilmService]
})
export class FilmEditComponent implements OnInit, OnDestroy {

  film: FilmViewDTO;
  private id: number;

  private paramsSub: Subscription;

  constructor(private filmService: FilmService, private router: Router, private route: ActivatedRoute) { }

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
      this.filmService.update(this.id, event.value).subscribe(
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

  private markTouched(group: FormGroup | FormArray) {
    markTouched(group);
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }
}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { FilmService } from '../../../services/film.service';
import { isValidationError, ValidationError } from '../../../model/error';
import { CustomValidators } from '../../../validators/custom-validators';
import { Subscription } from 'rxjs';
import { FilmViewDTO } from '../../../model/film';
import { PublicationType } from '../../../model/publication';

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
        this.film = film;
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
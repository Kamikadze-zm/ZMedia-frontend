import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { isValidationError, ValidationError } from '../../../model/error';
import { CustomValidators } from '../../../validators/custom-validators';
import { Subscription } from 'rxjs';
import { PublicationType } from '../../../model/publication';
import { TvSeriesService } from '../../../services/tv-series.service';
import { TvSeriesViewDTO } from '../../../model/tv-series';
import { plainToClass } from 'class-transformer';

@Component({
  selector: 'app-tv-series-edit',
  templateUrl: './tv-series-edit.component.html',
  providers: [TvSeriesService]
})
export class TvSeriesEditComponent implements OnInit, OnDestroy {

  tvSeries: TvSeriesViewDTO;
  private id: number;

  private paramsSub: Subscription;

  constructor(private filmService: TvSeriesService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.filmService.getById(this.id).subscribe((tvSeries: TvSeriesViewDTO) => {
        this.tvSeries = plainToClass(TvSeriesViewDTO, tvSeries);
      });
    });
  }

  edit(event: FormGroup): void {
    if (event.valid) {
      this.filmService.update(this.id, event.value).subscribe(
        () => { this.router.navigate([`/${PublicationType.TV_SERIES}`, this.id]) },
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
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormArray } from '@angular/forms';
import { isValidationError, ValidationError } from '../../../model/error';
import { CustomValidators } from '../../../validators/custom-validators';
import { TvSeriesService } from '../../../services/tv-series.service';
import { PublicationType } from '../../../model/publication';
import { TvSeriesViewDTO } from '../../../model/tv-series';
import { plainToClass } from 'class-transformer';
import { markTouched } from '../../../util/forms-util';

@Component({
  selector: 'app-tv-series-add',
  templateUrl: './tv-series-add.component.html',
  providers: [TvSeriesService]
})
export class TvSeriesAddComponent {

  from: number;
  tvSeries: TvSeriesViewDTO;

  constructor(private tvSeriesService: TvSeriesService, private router: Router) { }

  add(event: FormGroup): void {
    if (event.valid) {
      this.tvSeriesService.add(event.value).subscribe(
        (id: number) => { this.router.navigate([`/${PublicationType.TV_SERIES}`, id]) },
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
      this.tvSeriesService.getById(this.from).subscribe((tvSeries: TvSeriesViewDTO) => {
        this.tvSeries = plainToClass(TvSeriesViewDTO, tvSeries);
      });
    }
  }
}
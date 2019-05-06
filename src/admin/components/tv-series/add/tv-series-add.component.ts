import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormArray } from '@angular/forms';
import { plainToClass } from 'class-transformer';

import { PublicationType } from 'src/publication/publication';
import { isValidationError, ValidationError } from 'src/core/model/error';
import { addError, markTouched } from 'src/core/components/reactive-form-component';
import { TvSeriesService } from 'src/tv-series/tv-series.service';
import { TvSeriesViewDTO } from 'src/tv-series/tv-series';
import { AdminTvSeriesService } from 'src/admin/services/admin-tv-series.service';

@Component({
  selector: 'app-tv-series-add',
  templateUrl: './tv-series-add.component.html',
  providers: [AdminTvSeriesService, TvSeriesService]
})
export class TvSeriesAddComponent {

  from: number;
  tvSeries: TvSeriesViewDTO;

  constructor(private adminTvSeriesService: AdminTvSeriesService,
    private tvSeriesService: TvSeriesService,
    private router: Router) { }

  add(event: FormGroup): void {
    if (event.valid) {
      this.adminTvSeriesService.add(event.value).subscribe(
        (id: number) => { this.router.navigate([`/${PublicationType.TV_SERIES}`, id]) },
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

  fill(): void {
    if (this.from) {
      this.tvSeriesService.getById(this.from).subscribe((tvSeries: TvSeriesViewDTO) => {
        this.tvSeries = plainToClass(TvSeriesViewDTO, tvSeries);
      });
    }
  }

  private markTouched(group: FormGroup | FormArray) {
    markTouched(group);
  }
}
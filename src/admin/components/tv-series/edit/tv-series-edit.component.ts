import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { plainToClass } from 'class-transformer';

import { PublicationType } from 'src/publication/publication';
import { isValidationError, ValidationError } from 'src/core/model/error';
import { addError, markTouched } from 'src/core/components/reactive-form-component';
import { TvSeriesService } from 'src/tv-series/tv-series.service';
import { TvSeriesViewDTO } from 'src/tv-series/tv-series';
import { AdminTvSeriesService } from 'src/admin/services/admin-tv-series.service';

@Component({
  selector: 'app-tv-series-edit',
  templateUrl: './tv-series-edit.component.html',
  providers: [AdminTvSeriesService, TvSeriesService]
})
export class TvSeriesEditComponent implements OnInit, OnDestroy {

  tvSeries: TvSeriesViewDTO;
  private id: number;

  private paramsSub: Subscription;

  constructor(private adminTvSeriesService: AdminTvSeriesService,
    private tvSeriesService: TvSeriesService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.tvSeriesService.getById(this.id).subscribe((tvSeries: TvSeriesViewDTO) => {
        this.tvSeries = plainToClass(TvSeriesViewDTO, tvSeries);
      });
    });
  }

  edit(event: FormGroup): void {
    if (event.valid) {
      this.adminTvSeriesService.update(this.id, event.value).subscribe(
        () => { this.router.navigate([`/${PublicationType.TV_SERIES}`, this.id]) },
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
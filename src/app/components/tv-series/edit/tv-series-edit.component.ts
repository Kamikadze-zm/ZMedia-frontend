import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray } from '@angular/forms';
import { isValidationError, ValidationError } from '../../../model/error';
import { Subscription } from 'rxjs';
import { PublicationType } from '../../../model/publication';
import { TvSeriesService } from '../../../services/tv-series.service';
import { TvSeriesViewDTO } from '../../../model/tv-series';
import { plainToClass } from 'class-transformer';
import { markTouched, addError } from '../../../util/forms-util';

@Component({
  selector: 'app-tv-series-edit',
  templateUrl: './tv-series-edit.component.html',
  providers: [TvSeriesService]
})
export class TvSeriesEditComponent implements OnInit, OnDestroy {

  tvSeries: TvSeriesViewDTO;
  private id: number;

  private paramsSub: Subscription;

  constructor(private tvSeriesService: TvSeriesService, private router: Router, private route: ActivatedRoute) { }

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
      this.tvSeriesService.update(this.id, event.value).subscribe(
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

  private markTouched(group: FormGroup | FormArray) {
    markTouched(group);
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }
}
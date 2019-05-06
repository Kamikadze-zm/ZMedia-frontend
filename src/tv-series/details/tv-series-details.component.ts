import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { plainToClass } from "class-transformer";

import { TvSeriesService } from '../tv-series.service';
import { TvSeriesViewDTO } from '../tv-series';
import { PublicationType } from 'src/publication/publication';

@Component({
  selector: 'app-tv-series-details',
  templateUrl: './tv-series-details.component.html',
  providers: [TvSeriesService]
})
export class TvSeriesDetailsComponent implements OnInit, OnDestroy {

  tvSeries: TvSeriesViewDTO;
  id: number;

  type: PublicationType = PublicationType.TV_SERIES;

  private paramsSub: Subscription;

  constructor(private tvSeriesService: TvSeriesService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.load(this.id);
    });
  }

  load(id: number): void {
    this.tvSeriesService.getById(id).subscribe((tvSeries: TvSeriesViewDTO) => {
      this.tvSeries = plainToClass(TvSeriesViewDTO, tvSeries);
    });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }
}
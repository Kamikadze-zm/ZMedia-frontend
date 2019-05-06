import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { plainToClass } from 'class-transformer';

import { TvSeriesService } from 'src/tv-series/tv-series.service';
import { TvSeriesViewDTO } from 'src/tv-series/tv-series';
import { PublicationType } from 'src/publication/publication';
import { AdminTvSeriesService } from 'src/admin/services/admin-tv-series.service';

@Component({
  selector: 'app-tv-series-delete',
  templateUrl: './tv-series-delete.component.html',
  providers: [AdminTvSeriesService, TvSeriesService]
})
export class TvSeriesDeleteComponent implements OnInit, OnDestroy {

  private paramsSub: Subscription;

  tvSeries: TvSeriesViewDTO;

  constructor(private adminTvSeriesService: AdminTvSeriesService,
    private tvSeriesService: TvSeriesService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      const id: number = params['id'];
      this.tvSeriesService.getById(id).subscribe((tvSeries: TvSeriesViewDTO) => {
        this.tvSeries = plainToClass(TvSeriesViewDTO, tvSeries);
      });
    });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }

  delete() {
    this.adminTvSeriesService.deleteById(this.tvSeries.id).subscribe(() => {
      this.router.navigate([`/${PublicationType.TV_SERIES}`])
    });
  }
}
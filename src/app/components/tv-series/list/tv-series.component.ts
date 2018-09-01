import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Pagination } from '../../../model/pagination';
import { TvSeriesService } from '../../../services/tv-series.service';
import { TvSeriesShortViewDTO, TvSeriesPage } from '../../../model/tv-series';
import { plainToClass } from 'class-transformer';

@Component({
  selector: 'app-tv-series',
  templateUrl: './tv-series.component.html',
  providers: [TvSeriesService]
})
export class TvSeriesComponent implements OnInit, OnDestroy {
  tvSeries: Array<TvSeriesShortViewDTO>;
  pagination: Pagination;
  private page: number;

  private queryParamsSub: Subscription;

  constructor(private tvSeriesService: TvSeriesService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.queryParamsSub = this.route.queryParams.subscribe(params => {
      this.page = params['page'];
      this.loadPage(this.page);
    });
  }

  loadPage(page: number): void {
    this.tvSeries = new Array<TvSeriesShortViewDTO>();
    this.tvSeriesService.getPage(page).subscribe((page: TvSeriesPage) => {
      this.pagination = new Pagination(page.pagination.currentPage, page.pagination.pages);
      this.tvSeries = plainToClass(TvSeriesShortViewDTO, page.publications);
    });
  }

  ngOnDestroy() {
    this.queryParamsSub.unsubscribe;
  }
}
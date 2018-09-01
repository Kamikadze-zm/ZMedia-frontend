import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { plainToClass } from "class-transformer";
import { PublicationDeleteModalComponent } from '../../publications/delete-modal/publication-delete-modal.component';
import { TvSeriesService } from '../../../services/tv-series.service';
import { TvSeriesViewDTO } from '../../../model/tv-series';
import { PublicationType } from '../../../model/publication';

@Component({
  selector: 'app-tv-series-details',
  templateUrl: './tv-series-details.component.html',
  providers: [TvSeriesService]
})
export class TvSeriesDetailsComponent implements OnInit, OnDestroy {

  @ViewChild(PublicationDeleteModalComponent) deleteComponent: PublicationDeleteModalComponent;

  tvSeries: TvSeriesViewDTO;
  id: number;

  type: PublicationType = PublicationType.TV_SERIES;

  private paramsSub: Subscription;

  constructor(private tvSeriesService: TvSeriesService, private route: ActivatedRoute, private router: Router) { }

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

  showModal() {
    this.deleteComponent.show();
  }

  delete() {
    this.tvSeriesService.deleteById(this.id).subscribe(() => {
      this.router.navigate([`/${PublicationType.TV_SERIES}`])
    });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }
}
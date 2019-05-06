import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { plainToClass } from 'class-transformer';

import { FilmService } from '../film.service';
import { FilmShortViewDTO, FilmsPage } from '../film';
import { Pagination } from 'src/publication/pagination';

@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  providers: [FilmService]
})
export class FilmsComponent implements OnInit, OnDestroy {

  films: Array<FilmShortViewDTO>;
  pagination: Pagination;

  private page: number;

  private queryParamsSub: Subscription;

  constructor(private filmService: FilmService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.queryParamsSub = this.route.queryParams.subscribe(params => {
      this.page = params['page'];
      this.loadFilmsPage(this.page);
    });
  }

  loadFilmsPage(page: number): void {
    this.films = new Array<FilmShortViewDTO>();
    this.filmService.getPage(page).subscribe((filmsPage: FilmsPage) => {
      this.pagination = new Pagination(filmsPage.pagination.currentPage, filmsPage.pagination.pages);
      this.films = plainToClass(FilmShortViewDTO, filmsPage.publications);
    });
  }

  ngOnDestroy() {
    this.queryParamsSub.unsubscribe;
  }
}
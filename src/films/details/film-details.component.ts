import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { plainToClass } from "class-transformer";

import { FilmService } from '../film.service';
import { FilmViewDTO } from '../film';
import { PublicationType } from 'src/publication/publication';

@Component({
  selector: 'app-film-details',
  templateUrl: './film-details.component.html',
  providers: [FilmService]
})
export class FilmDetailsComponent implements OnInit, OnDestroy {

  film: FilmViewDTO;
  id: number;

  type: PublicationType = PublicationType.FILM;

  private paramsSub: Subscription;

  constructor(private filmService: FilmService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.loadFilm(this.id);
    });
  }

  loadFilm(id: number): void {
    this.filmService.getById(id).subscribe((film: FilmViewDTO) => {
      this.film = plainToClass(FilmViewDTO, film);
    });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }
}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { plainToClass } from 'class-transformer';

import { FilmService } from 'src/films/film.service';
import { FilmViewDTO } from 'src/films/film';
import { PublicationType } from 'src/publication/publication';
import { AdminFilmService } from 'src/admin/services/admin-film.service';

@Component({
  selector: 'app-film-delete',
  templateUrl: './film-delete.component.html',
  providers: [AdminFilmService, FilmService]
})
export class FilmDeleteComponent implements OnInit, OnDestroy {

  private paramsSub: Subscription;

  film: FilmViewDTO;

  constructor(private adminFilmService: AdminFilmService,
    private filmService: FilmService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      const id: number = params['id'];
      this.filmService.getById(id).subscribe((film: FilmViewDTO) => {
        this.film = plainToClass(FilmViewDTO, film);
      });
    });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }

  delete() {
    this.adminFilmService.deleteById(this.film.id).subscribe(() => {
      this.router.navigate([`/${PublicationType.FILM}`])
    });
  }
}

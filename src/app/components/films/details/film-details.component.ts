import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { plainToClass } from "class-transformer";
import { FilmService } from '../../../services/film.service';
import { FilmViewDTO } from '../../../model/film';
import { PublicationDeleteModalComponent } from '../../publications/delete-modal/publication-delete-modal.component';
import { PublicationType } from '../../../model/publication';

@Component({
  selector: 'app-film-details',
  templateUrl: './film-details.component.html',
  providers: [FilmService]
})
export class FilmDetailsComponent implements OnInit, OnDestroy {

  @ViewChild(PublicationDeleteModalComponent) deleteComponent: PublicationDeleteModalComponent;

  film: FilmViewDTO;
  id: number;

  type: PublicationType = PublicationType.FILM;

  private paramsSub: Subscription;

  constructor(private filmService: FilmService, private route: ActivatedRoute, private router: Router) { }

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

  showModal() {
    this.deleteComponent.show();
  }

  delete() {
    this.filmService.deleteById(this.id).subscribe(() => {
      this.router.navigate([`/${PublicationType.FILM}`])
    });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }
}
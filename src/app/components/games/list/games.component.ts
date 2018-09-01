import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { Pagination } from '../../../model/pagination';
import { GameService } from '../../../services/game.service';
import { GameShortViewDTO, GamesPage } from '../../../model/game';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  providers: [GameService]
})
export class GamesComponent implements OnInit, OnDestroy {

  games: Array<GameShortViewDTO>;
  pagination: Pagination;
  private page: number;

  private queryParamsSub: Subscription;

  constructor(private gameService: GameService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.queryParamsSub = this.route.queryParams.subscribe(params => {
      this.page = params['page'];
      this.loadPage(this.page);
    });
  }

  loadPage(page: number): void {
    this.games = new Array<GameShortViewDTO>();
    this.gameService.getPage(page).subscribe((gamesPage: GamesPage) => {
      this.pagination = new Pagination(gamesPage.pagination.currentPage, gamesPage.pagination.pages);
      this.games = plainToClass(GameShortViewDTO, gamesPage.publications);
    });
  }

  ngOnDestroy() {
    this.queryParamsSub.unsubscribe;
  }
}
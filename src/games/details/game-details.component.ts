import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { plainToClass } from "class-transformer";

import { GameService } from '../game.service';
import { GameViewDTO } from '../game';
import { PublicationType } from 'src/publication/publication';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  providers: [GameService]
})
export class GameDetailsComponent implements OnInit, OnDestroy {

  game: GameViewDTO;
  id: number;

  type: PublicationType = PublicationType.GAME;

  private paramsSub: Subscription;

  constructor(private gameService: GameService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.load(this.id);
    });
  }

  load(id: number): void {
    this.gameService.getById(id).subscribe((game: GameViewDTO) => {
      this.game = plainToClass(GameViewDTO, game);
    });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }
}
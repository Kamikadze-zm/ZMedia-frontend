import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { plainToClass } from "class-transformer";
import { PublicationDeleteModalComponent } from '../../publications/delete-modal/publication-delete-modal.component';
import { PublicationType } from '../../../model/publication';
import { GameService } from '../../../services/game.service';
import { GameViewDTO } from '../../../model/game';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  providers: [GameService]
})
export class GameDetailsComponent implements OnInit, OnDestroy {

  @ViewChild(PublicationDeleteModalComponent) deleteComponent: PublicationDeleteModalComponent;

  game: GameViewDTO;
  id: number;

  type: PublicationType = PublicationType.GAME;

  private paramsSub: Subscription;

  constructor(private gameService: GameService, private route: ActivatedRoute, private router: Router) { }

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

  showModal() {
    this.deleteComponent.show();
  }

  delete() {
    this.gameService.deleteById(this.id).subscribe(() => {
      this.router.navigate([`/${PublicationType.GAME}`])
    });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }
}
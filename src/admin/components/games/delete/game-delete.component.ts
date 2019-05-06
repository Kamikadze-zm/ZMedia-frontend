import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { PublicationType } from 'src/publication/publication';
import { GameService } from 'src/games/game.service';
import { GameViewDTO } from 'src/games/game';
import { AdminGameService } from 'src/admin/services/admin-game.service';

@Component({
  selector: 'app-game-delete',
  templateUrl: './game-delete.component.html',
  providers: [AdminGameService, GameService]
})
export class GameDeleteComponent implements OnInit, OnDestroy {

  private paramsSub: Subscription;

  game: GameViewDTO;

  constructor(private adminGameService: AdminGameService,
    private gameService: GameService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      const id: number = params['id'];
      this.gameService.getById(id).subscribe((game: GameViewDTO) => {
        this.game = plainToClass(GameViewDTO, game);
      });
    });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }

  delete() {
    this.adminGameService.deleteById(this.game.id).subscribe(() => {
      this.router.navigate([`/${PublicationType.GAME}`])
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { NoveltyDTO } from '../../model/publication';
import { NoveltiesService } from '../../services/novelties.service';

@Component({
  selector: 'app-novelties',
  templateUrl: './novelties.component.html',
  providers: [NoveltiesService]
})
export class NoveltiesComponent implements OnInit {
  novelties: Array<NoveltyDTO>;

  constructor(private noveltiesService: NoveltiesService) {
    this.novelties = new Array<NoveltyDTO>();
  }

  ngOnInit() {
    this.noveltiesService.getNovelties().subscribe((novelties: NoveltyDTO[]) => {
      novelties.forEach(n => this.novelties.push(new NoveltyDTO(n.id, n.header, n.note, n.coverLink, n.description, n.type)));
    });
  }
}
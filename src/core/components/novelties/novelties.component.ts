import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { isSupported } from '@firebase/messaging'

import { NoveltyDTO } from '../../model/novelty';
import { NoveltiesService } from '../../services/novelties.service';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-novelties',
  templateUrl: './novelties.component.html',
  providers: [NoveltiesService]
})
export class NoveltiesComponent implements OnInit, OnDestroy {
  novelties: Array<NoveltyDTO>;

  notificationsIsAvailable: boolean = false;
  isSubscribed: boolean = false;

  private isSubscribedSub: Subscription;

  constructor(private noveltiesService: NoveltiesService, private notificationsService: NotificationsService) {
    this.novelties = new Array<NoveltyDTO>();
  }

  ngOnInit() {
    this.noveltiesService.getNovelties().subscribe((novelties: NoveltyDTO[]) => {
      novelties.forEach(n => this.novelties.push(new NoveltyDTO(n.id, n.header, n.note, n.coverLink, n.description, n.type)));
    });
    if (isSupported()) {
      if (Notification['permission'] !== 'granted') {
        this.unsubscribe();
      }
      if (Notification['permission'] !== 'denied') {
        this.notificationsIsAvailable = true;
        this.isSubscribedSub = this.notificationsService.isSubscribed$.subscribe((v: boolean) => {
          this.isSubscribed = v;
        });
      }
    }
  }

  subscribe(): void {
    if (Notification['permission'] === 'denied') {
      alert('У Вас заблокированы уведомления');
      this.notificationsIsAvailable = false;
    } else {
      this.notificationsService.subscribe();
    }
  }

  unsubscribe(): void {
    this.notificationsService.unsubscribe();
  }

  ngOnDestroy() {
    if (this.isSubscribedSub) {
      this.isSubscribedSub.unsubscribe();
    }
  }
}
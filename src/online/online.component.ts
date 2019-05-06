import { Component, OnInit } from '@angular/core';

import { StreamInfo } from './stream-info';
import { OnlineService } from './online.service';

@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.css'],
  providers: [OnlineService]
})
export class OnlineComponent implements OnInit {

  private readonly absentStreamMessage: string = "Активные трансляции отсутствуют";
  private readonly streamEndedMessage: string = "Трансляция завершена";

  streamName: string;
  streamSrc: string;

  constructor(private onlineService: OnlineService) { }

  ngOnInit() {
    this.getStreamInfo();
  }

  finish(isFinshed: boolean): void {
    if (isFinshed) {
      this.streamName = this.streamEndedMessage;
    }
  }

  private getStreamInfo(): void {
    this.onlineService.getStreamInfo().subscribe((si: StreamInfo) => {
      if (si) {
        this.streamName = si.name;
        this.streamSrc = si.path;
      } else {
        this.setAbsentStream();
      }
    }, () => {
      this.setAbsentStream();
    });
  }

  private setAbsentStream() {
    this.streamName = this.absentStreamMessage;
  }
}
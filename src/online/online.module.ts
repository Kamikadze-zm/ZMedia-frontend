import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { OnlineRoutingModule } from './online-routing.module';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { OnlineComponent } from './online.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OnlineRoutingModule
  ],
  declarations: [
    VideoPlayerComponent,
    OnlineComponent
  ]
})
export class OnlineModule { }

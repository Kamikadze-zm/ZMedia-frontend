import { Component, Input, ViewChild, ElementRef, EventEmitter, Output, OnChanges, OnDestroy } from '@angular/core';
import { MediaPlayerClass, MediaPlayer, PlaybackPausedEvent } from 'dashjs';
import { Debounce, debounce } from 'src/app/util/debounce';

@Component({
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnChanges, OnDestroy {

  @Input("src") src: string;
  @Output("finished") finishedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('videoPlayer') playerElement: ElementRef;
  private isSetup: boolean = false;

  private dashPlayer: MediaPlayerClass;
  private videoContainer: HTMLElement;
  private video: HTMLVideoElement;

  private readonly playTitle: string = "Играть";
  private readonly stopTitle: string = "Стоп";
  // private readonly playIcon: string = "▶"; //не работает в эдже и мобильных вебкитах
  // private readonly stopIcon: string = "◼";
  private readonly playIcon: string = "glyphicon-play";
  private readonly stopIcon: string = "glyphicon-stop";
  private readonly muteTitle: string = "Выключить звук";
  private readonly unmuteTitle: string = "Включить звук";
  private readonly muteIcon: string = "glyphicon-volume-up";
  private readonly unmuteIcon: string = "glyphicon-volume-off";
  private readonly fullscreenModeTitle: string = "На весь экран";
  private readonly normalModeTitle: string = "Обычный режим";
  private readonly fullscreenModeIcon: string = "glyphicon-resize-full";
  private readonly normalModeIcon: string = "glyphicon-resize-small";

  private readonly volumeKey: string = "volume";
  private readonly muteKey: string = "mute";

  private readonly controlsTimeout: number = 5000;

  private mute: boolean;
  private volume: number;

  private mouseOverControls: boolean;
  private controlsTimerId: number;

  playerVisible: boolean = false;
  controlsVisible: boolean = true;
  cursorVisible: boolean = true;

  playStopTitle: string = this.playTitle;
  // playStopIcon: string = this.playIcon;
  playStopClass: string = this.playIcon;
  rangeVolume: number;
  muteUnmuteTitle: string = this.muteTitle;
  muteUnmuteClass: string = this.muteIcon;
  fullscreenNormalModeTitle: string = this.fullscreenModeTitle;
  fullscreenNormalModeClass: string = this.fullscreenModeIcon;

  ngOnChanges() {
    if (!this.src || this.isSetup) {
      return;
    }
    this.video = this.playerElement.nativeElement as HTMLVideoElement;
    this.videoContainer = this.video.parentElement;
    this.volume = this.loadVolume();
    this.rangeVolume = this.volume;
    this.mute = this.loadMute();
    this.setupPlayer();
    this.isSetup = true;
  }

  ngOnDestroy() {
    this.cancelControlsTimer();
  }

  playStop(): void {
    if (this.dashPlayer.isPaused()) {
      this.play();
    } else {
      this.stop();
    }
  }

  muteUnmute(): void {
    const mute: boolean = !this.mute;
    this.setMute(mute);
  }

  changeVolume(value: number): void {
    if (value) {
      this.setVolume(value);
    }
  }

  fullscreenNormalMode(): void {
    if (this.isFullscreen()) {
      this.setNormalMode();
    } else {
      this.setFullscreenMode();
    }
  }

  mouseEnterToPlayer() {
    this.showControls();
    this.startControlsTimer();
  }

  mouseLeaveFromPlayer() {
    this.cancelControlsTimer();
    this.hideControls();
  }

  mouseMoveInPlayer() {
    this.showControls();
    if (!this.mouseOverControls) {
      this.updateControlsTimer();
    }
  }

  mouseEnterToControls() {
    this.mouseOverControls = true;
    this.cancelControlsTimer();
  }

  mouseLeaveFromControls() {
    this.mouseOverControls = false;
    this.startControlsTimer();
  }

  private play(): void {
    this.dashPlayer.play();
    this.playStopTitle = this.stopTitle;
    this.playStopClass = this.stopIcon;
  }

  private stop(): void {
    this.dashPlayer.pause();
    this.playStopTitle = this.playTitle;
    this.playStopClass = this.playIcon;
  }

  private setMute(mute: boolean): void {
    if (mute) {
      this.setVolume(0);
    } else {
      this.setVolume(this.volume);
    }
  }

  private setMuteTitle() {
    this.muteUnmuteTitle = this.muteTitle;
    this.muteUnmuteClass = this.muteIcon;
  }

  private setUnmuteTitle() {
    this.muteUnmuteTitle = this.unmuteTitle;
    this.muteUnmuteClass = this.unmuteIcon;
  }

  private setVolume(level: number): void {
    this.rangeVolume = level;
    if (level == 0) {
      this.mute = true;
      this.setUnmuteTitle();
    } else {
      this.volume = level;
      this.mute = false;
      this.setMuteTitle();
    }
    this.dashPlayer.setVolume(level / 100);
    this.saveMute(this.mute);
    this.saveVolume(this.volume);
  }

  private setFullscreenMode(): void {
    if (this.videoContainer.requestFullscreen) {
      this.videoContainer.requestFullscreen();
    } else if (this.videoContainer['mozRequestFullScreen']) {
      this.videoContainer['mozRequestFullScreen']();
    } else if (this.videoContainer['webkitRequestFullscreen']) {
      this.videoContainer['webkitRequestFullscreen']();
    } else if (this.videoContainer['msRequestFullscreen']) {
      this.videoContainer['msRequestFullscreen']();
    }
  }

  private setNormalMode(): void {
    if (this.video.ownerDocument.exitFullscreen) {
      this.video.ownerDocument.exitFullscreen();
    } else if (this.video.ownerDocument['mozCancelFullScreen']) {
      this.video.ownerDocument['mozCancelFullScreen']();
    } else if (this.video.ownerDocument['webkitExitFullscreen']) {
      this.video.ownerDocument['webkitExitFullscreen']();
    } else if (this.video.ownerDocument['msExitFullscreen']) {
      this.video.ownerDocument['msExitFullscreen']();
    }
  }

  private setFullscreenModeTitle() {
    this.fullscreenNormalModeTitle = this.fullscreenModeTitle;
    this.fullscreenNormalModeClass = this.fullscreenModeIcon;
  }

  private setNormalModeTitle() {
    this.fullscreenNormalModeTitle = this.normalModeTitle;
    this.fullscreenNormalModeClass = this.normalModeIcon;
  }

  private isFullscreen(): boolean {
    const document: Document = this.video.ownerDocument;
    return document.fullscreenElement ||
      document['webkitFullscreenElement'] ||
      document['mozFullScreenElement'] ||
      document['msFullscreenElement'];
  };

  private setupPlayer(): void {
    if (this.src) {
      this.dashPlayer = MediaPlayer().create();
      this.dashPlayer.initialize(this.playerElement.nativeElement as HTMLElement, this.src, false);
      this.dashPlayer.on("playbackPaused", this.finish);
      this.setVolume(this.volume);
      this.setMute(this.mute);
      this.addFullscreenChangeListners();
      this.playerVisible = true;
    }
  }

  private addFullscreenChangeListners(): void {
    this.addFullscreenChangeListner('fullscreenchange');
    this.addFullscreenChangeListner('mozfullscreenchange');
    this.addFullscreenChangeListner('webkitfullscreenchange');
    this.addFullscreenChangeListner('msfullscreenchange');
  }

  private addFullscreenChangeListner(eventName: string): void {
    this.video.ownerDocument.addEventListener(eventName, () => {
      if (this.isFullscreen()) {
        this.setNormalModeTitle();
      } else {
        this.setFullscreenModeTitle();
      }
    });
  }

  private finish(event: PlaybackPausedEvent): void {
    if (event.ended) {
      console.log("playback ended")
      this.finishedEvent.emit(true);
      this.playerVisible = false;
    }
  }

  private saveVolume(volume: number): void {
    localStorage.setItem(this.volumeKey, volume.toString());
  }

  private loadVolume(): number {
    let volume: string = localStorage.getItem(this.volumeKey);
    if (volume || volume === '0') {
      return Number.parseInt(volume);
    }
    return 100;
  }

  private saveMute(mute: boolean): void {
    localStorage.setItem(this.muteKey, String(mute));
  }

  private loadMute(): boolean {
    let mute: string = localStorage.getItem(this.muteKey);
    return Boolean(mute);
  }

  private showControls(): void {
    if (!this.controlsVisible) {
      this.controlsVisible = true;
    }
    if (!this.cursorVisible) {
      this.cursorVisible = true;
    }
  }

  private hideControls(): void {
    if (this.controlsVisible) {
      this.controlsVisible = false;
    }
    if (this.cursorVisible) {
      this.cursorVisible = false;
    }
  }

  private startControlsTimer(): void {
    this.controlsTimerId = window.setTimeout(this.hideControls.bind(this), this.controlsTimeout);
  }

  private debouncedStartControlsTimer: Debounce = debounce(this.startControlsTimer.bind(this), 1000);

  private cancelControlsTimer(): void {
    if (this.controlsTimerId) {
      window.clearTimeout(this.controlsTimerId)
      this.controlsTimerId = null;
    }
    this.debouncedStartControlsTimer.cancel();
  }

  private updateControlsTimer(): void {
    this.cancelControlsTimer();
    this.debouncedStartControlsTimer.start();
  }
}

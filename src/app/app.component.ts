import { Component, OnInit, HostListener } from '@angular/core';
import { initializeApp } from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private year: number;

  isShowToTop: boolean = false;

  ngOnInit() {
    initializeApp({
      'messagingSenderId': '10619003428'
    });
  }

  get currentYear(): number {
    if (!this.year) {
      this.year = new Date().getFullYear();
    }
    return this.year;
  }

  goToTop(): void {
    window.scrollTo(0, 0);
  }

  @HostListener('window:scroll', ['$event'])
  scroll() {
    if (window.pageYOffset > 500) {
      this.isShowToTop = true;
    } else {
      this.isShowToTop = false;
    }
  }

}
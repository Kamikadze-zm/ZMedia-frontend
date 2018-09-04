import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ngOnInit() {
    initializeApp({
      'messagingSenderId': '10619003428'
    });
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }
}
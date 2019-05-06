import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html'
})
export class AccessDeniedComponent {

  constructor(private location: Location) { }

  back() {
    this.location.back();
  }
}
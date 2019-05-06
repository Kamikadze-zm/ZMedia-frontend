import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'search-byname-form',
  templateUrl: './search-byname-form.component.html'
})
export class SearchByNameFormComponent {

  input: FormControl;

  constructor(private router: Router) {
    this.input = new FormControl();
  }

  search(): void {
    const value: string = this.input.value;
    if (value) {
      this.input.setValue(null);
      this.router.navigate(['/search/', value]);
    } else {
      this.router.navigate(['/search/']);
    }
  }
}

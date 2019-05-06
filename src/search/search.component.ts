import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ReactiveFormComponent } from 'src/core/components/reactive-form-component';
import { CustomValidators } from 'src/validators/custom-validators';
import { SearchService } from './search.service';
import { SearchResult } from './search-result';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  providers: [SearchService]
})
export class SearchComponent implements OnInit, OnDestroy, ReactiveFormComponent {

  queryControl: FormControl;
  searchResults: SearchResult[] = [];
  notFound: boolean = false;

  private paramsSub: Subscription;

  constructor(private searchService: SearchService, private route: ActivatedRoute) {
    this.queryControl = new FormControl(null,
      [CustomValidators.required('Введите поисковый запрос'),
      CustomValidators.size(3, null, 'Поисковый запрос должен содержать минимум 3 символа')]);
  }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      const name = params['name'];
      if (name) {
        this.queryControl.setValue(name);
        this.search();
      }
    });
  }

  search(): void {
    if (this.queryControl.invalid) {
      this.queryControl.markAsTouched();
    } else {
      this.searchResults = [];
      this.searchService.searchByName(this.queryControl.value).subscribe(
        (results: SearchResult[]) => {
          if (!results || results.length == 0) {
            this.notFound = true;
          } else {
            this.notFound = false;
            results.forEach(r => this.searchResults.push(new SearchResult(r.publication, r.type)));
          }
        });
    }
  }

  isValid(): boolean {
    return this.queryControl.valid && (this.queryControl.touched || this.queryControl.dirty);
  }

  isInvalid(): boolean {
    return this.queryControl.invalid && (this.queryControl.touched || this.queryControl.dirty);
  }

  getErrors(): string[] {
    const errors: string[] = [];
    if (this.queryControl.errors) {
      for (let k in this.queryControl.errors) {
        errors.push(this.queryControl.errors[k]);
      }
    }
    return errors;
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }
}

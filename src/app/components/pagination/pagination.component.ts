import { Component, Input, OnChanges } from '@angular/core';
import { Pagination } from '../../model/pagination';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: [],
})
export class PaginationComponent implements OnChanges {
  @Input() pagination: Pagination;

  ngOnChanges() {
    if (this.pagination == undefined) {
      this.pagination = new Pagination(1, 1);
    }
  }
}
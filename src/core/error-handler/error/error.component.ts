import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ErrorService } from '../error.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Error } from '../../model/error';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html'
})
export class ErrorComponent implements OnInit {

  status: string;
  statusText: string;
  message: string;

  constructor(private location: Location, private errorService: ErrorService) { }

  ngOnInit() {
    const error = this.errorService.pop();
    console.error(error);
    if (!error) {
      return;
    }
    if (error instanceof HttpErrorResponse) {
      this.status = error.status.toString();
      this.statusText = error.statusText;
      if (error.error && error.error instanceof Error) {
        this.message = error.error.message;
      } else {
        this.message = error.message;
      }
    } else {
      this.message = error.message;
    }
  }

  back() {
    this.location.back();
  }
}
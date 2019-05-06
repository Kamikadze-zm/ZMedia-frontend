import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/shared/shared.module';
import { PaginationComponent } from './pagination/pagination.component';
import { PublicationShortInfoComponent } from './short-info/publication-short-info.component';
import { PublicationDetailsInfoComponent } from './details-info/publication-details-info.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    PaginationComponent,
    PublicationShortInfoComponent,
    PublicationDetailsInfoComponent
  ],
  exports: [
    PaginationComponent,
    PublicationShortInfoComponent,
    PublicationDetailsInfoComponent
  ]
})
export class PublicationModule { }

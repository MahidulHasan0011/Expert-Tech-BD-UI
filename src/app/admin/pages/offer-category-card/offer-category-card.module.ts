import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { OfferCategoryCardRoutingModule } from './offer-category-card-routing.module';
import { OfferCategoryCardComponent } from './offer-category-card.component';
import { AddOfferCategoryOfferComponent } from './add-offer-category-offer/add-offer-category-offer.component';
import { MaterialModule } from '../../../material/material.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [OfferCategoryCardComponent, AddOfferCategoryOfferComponent],
  imports: [
    CommonModule,
    OfferCategoryCardRoutingModule,
    MaterialModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
  ],
})
export class OfferCategoryCardModule {}

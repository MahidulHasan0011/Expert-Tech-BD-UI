import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfferCategoryCardComponent } from './offer-category-card.component';
import { AddOfferCategoryOfferComponent } from './add-offer-category-offer/add-offer-category-offer.component';

const routes: Routes = [
  { path: '', component: OfferCategoryCardComponent },
  {
    path: 'add-offer-category-card',
    component: AddOfferCategoryOfferComponent,
  },
  {
    path: 'edit-offer-category-card/:id',
    component: AddOfferCategoryOfferComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfferCategoryCardRoutingModule {}

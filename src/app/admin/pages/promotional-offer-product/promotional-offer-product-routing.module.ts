import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PromotionalOfferProductComponent} from "./promotional-offer-product.component";
import {AddPromotionalOfferProductComponent} from "./add-promotional-offer-product/add-promotional-offer-product.component";

const routes: Routes = [
  {path: '', component: PromotionalOfferProductComponent},
  {path: 'add-promotional-offer-product', component: AddPromotionalOfferProductComponent},
  {path: 'edit-promotional-offer-product/:id', component: AddPromotionalOfferProductComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionalOfferProductRoutingModule { }

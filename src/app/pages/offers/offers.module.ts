import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OffersRoutingModule } from './offers-routing.module';
import { OffersComponent } from './offers.component';
import {ProductCardOneModule} from "../../shared/lazy-component/product-card-one/product-card-one.module";
import {PipesModule} from "../../shared/pipes/pipes.module";
import {TimeCounterOneModule} from "../../shared/lazy-component/time-counter-one/time-counter-one.module";
import {ProductCardOfferModule} from "../../shared/lazy-component/product-card-offer/product-card-offer.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {NgxSpinnerModule} from "ngx-spinner";


@NgModule({
  declarations: [
    OffersComponent
  ],
  imports: [
    CommonModule,
    OffersRoutingModule,
    ProductCardOneModule,
    PipesModule,
    TimeCounterOneModule,
    ProductCardOfferModule,
    FlexLayoutModule,
    NgxSpinnerModule
  ]
})
export class OffersModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromotionalOfferProductRoutingModule } from './promotional-offer-product-routing.module';
import { PromotionalOfferProductComponent } from './promotional-offer-product.component';
import { AddPromotionalOfferProductComponent } from './add-promotional-offer-product/add-promotional-offer-product.component';
import {MaterialModule} from "../../../material/material.module";
import {ReactiveFormsModule} from "@angular/forms";
import {FlexLayoutModule} from "@angular/flex-layout";
import {PipesModule} from "../../../shared/pipes/pipes.module";
import {PromoProductEditComponent} from "./promo-product-edit/promo-product-edit.component";
import {DigitOnlyModule} from "@uiowa/digit-only";


@NgModule({
  declarations: [
    PromotionalOfferProductComponent,
    AddPromotionalOfferProductComponent,
    PromoProductEditComponent
  ],
    imports: [
        CommonModule,
        PromotionalOfferProductRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        PipesModule,
        DigitOnlyModule
    ]
})
export class PromotionalOfferProductModule { }

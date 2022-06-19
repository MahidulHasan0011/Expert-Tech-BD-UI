import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShippingChargeRoutingModule } from './shipping-charge-routing.module';
import { ShippingChargeComponent } from './shipping-charge.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialModule} from "../../../material/material.module";


@NgModule({
  declarations: [
    ShippingChargeComponent
  ],
  imports: [
    CommonModule,
    ShippingChargeRoutingModule,
    MaterialModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ]
})
export class ShippingChargeModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromotionalOfferRoutingModule } from './promotional-offer-routing.module';
import { PromotionalOfferComponent } from './promotional-offer.component';
import { AddPromotionalOfferComponent } from './add-promotional-offer/add-promotional-offer.component';
import {MaterialModule} from "../../../material/material.module";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../../shared/shared.module";
import {AngularEditorModule} from "@kolkov/angular-editor";


@NgModule({
  declarations: [
    PromotionalOfferComponent,
    AddPromotionalOfferComponent
  ],
  imports: [
    CommonModule,
    PromotionalOfferRoutingModule,
    MaterialModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AngularEditorModule
  ]
})
export class PromotionalOfferModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RatingComponent} from './rating.component';
import {FlexModule} from '@angular/flex-layout';
import {MaterialModule} from '../../../material/material.module';



@NgModule({
  declarations: [
    RatingComponent
  ],
  imports: [
    CommonModule,
    FlexModule,
    MaterialModule
  ],
  exports: [
    RatingComponent
  ]
})
export class RatingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardTwoComponent } from './product-card-two.component';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '../../../material/material.module';
import {PipesModule} from '../../pipes/pipes.module';
import {FlexLayoutModule} from '@angular/flex-layout';



@NgModule({
  declarations: [
    ProductCardTwoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    PipesModule,
    FlexLayoutModule,
  ], exports: [
    ProductCardTwoComponent
  ]
})
export class ProductCardTwoModule { }

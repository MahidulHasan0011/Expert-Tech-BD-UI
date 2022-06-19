import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardOneComponent } from './product-card-one.component';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '../../../material/material.module';
import {PipesModule} from '../../pipes/pipes.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {LazyLoadImageModule} from 'ng-lazyload-image';



@NgModule({
  declarations: [
    ProductCardOneComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    PipesModule,
    FlexLayoutModule,
    LazyLoadImageModule,
  ], exports: [
    ProductCardOneComponent
  ]
})
export class ProductCardOneModule { }

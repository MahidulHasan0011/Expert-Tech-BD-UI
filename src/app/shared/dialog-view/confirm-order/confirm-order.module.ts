import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PipesModule} from '../../pipes/pipes.module';
import {MaterialModule} from '../../../material/material.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PipesModule,
    MaterialModule
  ]
})
export class ConfirmOrderModule { }

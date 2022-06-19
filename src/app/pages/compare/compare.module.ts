import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompareComponent } from './compare.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {MaterialModule} from '../../material/material.module';


const routes: Routes = [
  {path: '', component: CompareComponent}
];

@NgModule({
  declarations: [CompareComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PipesModule,
    SharedModule,
    MaterialModule,
  ]
})
export class CompareModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PcBuildComponent } from './pc-build.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ChooseProductComponent } from './choose-product/choose-product.component';
import { NgxPrintModule } from 'ngx-print';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';

const routes: Routes = [
  { path: '', component: PcBuildComponent },
  {
    path: 'choose/:id/:componentTag/:componentCatSlug',
    component: ChooseProductComponent,
  },
];

@NgModule({
  declarations: [PcBuildComponent, ChooseProductComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgxPrintModule,
    FormsModule,
    MaterialModule,
    PipesModule,
  ],
})
export class PcBuildModule {}

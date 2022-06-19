import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { RefundComponent } from './refund.component';
import {SharedModule} from "../../../shared/shared.module";
import {MaterialModule} from "../../../material/material.module";


export const routes = [
  { path: '', component: RefundComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    RefundComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MaterialModule,
    NgxPaginationModule
  ]
})
export class RefundModule { }

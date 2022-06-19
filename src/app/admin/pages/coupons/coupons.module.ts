import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CouponsComponent } from './coupons.component';
import { CouponDialogComponent } from './coupon-dialog/coupon-dialog.component';
import {SharedModule} from "../../../shared/shared.module";
import {MaterialModule} from "../../../material/material.module";

export const routes = [
  { path: '', component: CouponsComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    CouponsComponent,
    CouponDialogComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        SharedModule,
        NgxPaginationModule,
        MaterialModule
    ]
})
export class CouponsModule { }

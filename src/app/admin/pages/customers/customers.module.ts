import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import {FlexModule} from '@angular/flex-layout';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgxSpinnerModule} from 'ngx-spinner';
import {CustomerEditDialogComponent} from './customer-edit-dialog/customer-edit-dialog.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from "../../../material/material.module";


@NgModule({
  declarations: [
    CustomersComponent,
    CustomerEditDialogComponent
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    MaterialModule,
    FlexModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    ReactiveFormsModule
  ]
})
export class CustomersModule { }

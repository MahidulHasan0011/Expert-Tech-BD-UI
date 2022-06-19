import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ResetPasswordComponent } from './reset-password.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../shared/shared.module';
import {MaterialModule} from "../../../material/material.module";


@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    ResetPasswordRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class ResetPasswordModule { }

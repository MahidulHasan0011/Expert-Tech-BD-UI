import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewLoginRoutingModule } from './new-login-routing.module';
import { NewLoginComponent } from './new-login.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    NewLoginComponent
  ],
  imports: [
    CommonModule,
    NewLoginRoutingModule,
    MaterialModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
  ],
  exports:[
    NewLoginComponent
  ]
})
export class NewLoginModule { }

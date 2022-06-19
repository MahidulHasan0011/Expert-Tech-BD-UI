import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewCheckoutRoutingModule } from './new-checkout-routing.module';
import { NewCheckoutComponent } from './new-checkout.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { NewRegistrationModule } from '../new-registration/new-registration.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { LoginModule } from '../login/login.module';
import { NewLoginModule } from '../new-login/new-login.module';


@NgModule({
  declarations: [
    NewCheckoutComponent
  ],
  imports: [
    CommonModule,
    NewCheckoutRoutingModule,
    PipesModule,
    NewRegistrationModule,
    MaterialModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    NewLoginModule
  ],
  exports:[
    NewCheckoutComponent
  ]
})
export class NewCheckoutModule { }

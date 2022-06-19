import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewRegistrationRoutingModule } from './new-registration-routing.module';
import { NewRegistrationComponent } from './new-registration.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { CartModule } from '../cart/cart.module';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import { NewCheckoutModule } from '../new-checkout/new-checkout.module';

@NgModule({
  declarations: [
    NewRegistrationComponent
  ],
  imports: [
    CommonModule,
    NewRegistrationRoutingModule,
    MaterialModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    // CartModule,
    PipesModule,
    
  ],
  exports:[NewRegistrationComponent]
})
export class NewRegistrationModule { }

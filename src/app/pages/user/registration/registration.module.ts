import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RegistrationRoutingModule} from './registration-routing.module';
import {RegistrationComponent} from './registration.component';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../shared/shared.module';
import {AngularFireAuthModule} from '@angular/fire/auth';


@NgModule({
  declarations: [RegistrationComponent],
  imports: [
    CommonModule,
    RegistrationRoutingModule,
    MaterialModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    AngularFireAuthModule
  ]
})
export class RegistrationModule {
}

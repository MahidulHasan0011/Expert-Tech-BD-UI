import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import {ReactiveFormsModule} from '@angular/forms';
import { ImageCropComponent } from './image-crop/image-crop.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {AdminChangePasswordComponent} from './admin-change-password/admin-change-password.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgxSpinnerModule} from 'ngx-spinner';
import {MaterialModule} from "../../../material/material.module";
import {PipesModule} from "../../../shared/pipes/pipes.module";


@NgModule({
  declarations: [
    ProfileComponent,
    ImageCropComponent,
    AdminChangePasswordComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    ImageCropperModule,
    MatProgressSpinnerModule,
    PipesModule,
    FlexLayoutModule,
    NgxSpinnerModule
  ]
})
export class ProfileModule { }

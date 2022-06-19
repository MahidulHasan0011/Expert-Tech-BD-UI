import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ImageGalleryDialogComponent} from './image-gallery-dialog.component';
import {UploadImageComponent} from './upload-image/upload-image.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgxPaginationModule} from 'ngx-pagination';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    ImageGalleryDialogComponent,
    UploadImageComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    NgxPaginationModule,
    FormsModule,
    NgxDropzoneModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ]
})
export class ImageGalleryDialogModule {
}

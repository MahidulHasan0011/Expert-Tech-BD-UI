import { NgModule } from '@angular/core';
import {FilterFormBuilderComponent} from './filter-form-builder/filter-form-builder.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';



@NgModule({
  declarations: [
    FilterFormBuilderComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    FilterFormBuilderComponent
  ]
})
export class CommonSharedModule { }

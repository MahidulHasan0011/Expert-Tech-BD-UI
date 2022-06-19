import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PasswordRecoveryComponent} from './password-recovery.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material/material.module';

const routes: Routes = [
  {path: '', component: PasswordRecoveryComponent},
];

@NgModule({
  declarations: [PasswordRecoveryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ]
})
export class PasswordRecoveryModule {
}

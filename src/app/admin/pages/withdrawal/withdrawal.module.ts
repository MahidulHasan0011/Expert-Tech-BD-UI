import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { WithdrawalComponent } from './withdrawal.component';
import {SharedModule} from "../../../shared/shared.module";
import {MaterialModule} from "../../../material/material.module";
import {PipesModule} from "../../../shared/pipes/pipes.module";


export const routes = [
  { path: '', component: WithdrawalComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    WithdrawalComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MaterialModule,
    NgxPaginationModule,
    PipesModule
  ]
})
export class WithdrawalModule { }

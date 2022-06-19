import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuBuilderComponent} from './menu-builder.component';
import {RouterModule} from '@angular/router';
import {AddMainMenuComponent} from './add-main-menu/add-main-menu.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectFilterModule} from 'mat-select-filter';
import {UpdateMenuDialogComponent} from './update-menu-dialog/update-menu-dialog.component';
import {UpdatePriorityDialogComponent} from './update-priority-dialog/update-priority-dialog.component';
import {UpdateSubPriorityDialogComponent} from './update-sub-priority-dialog/update-sub-priority-dialog.component';
import {SharedModule} from "../../../shared/shared.module";
import {MaterialModule} from "../../../material/material.module";
import {PipesModule} from "../../../shared/pipes/pipes.module";

export const routes = [
  {path: '', component: MenuBuilderComponent, pathMatch: 'full'},
  {path: 'add', component: AddMainMenuComponent},
];


@NgModule({
  declarations: [MenuBuilderComponent, AddMainMenuComponent, UpdateMenuDialogComponent, UpdatePriorityDialogComponent, UpdateSubPriorityDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
    MatSelectFilterModule,
    FormsModule,
    MaterialModule,
    PipesModule,
  ]
})
export class MenuBuilderModule {
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { PageInfoComponent } from './page-info.component';
import { ViewPageComponent } from './view-page/view-page.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {SharedModule} from "../../../shared/shared.module";
import {MaterialModule} from "../../../material/material.module";



const routes: Routes = [
  {path: '', component: PageInfoComponent},
  {path: 'view/:pageSlug', component: ViewPageComponent},
];

@NgModule({
  declarations: [PageInfoComponent, ViewPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
    MaterialModule,
    AngularEditorModule
  ]
})
export class PageInfoModule {
}

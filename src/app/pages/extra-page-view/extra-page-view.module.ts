import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtraPageViewComponent } from './extra-page-view.component';
import {RouterModule, Routes} from '@angular/router';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {MaterialModule} from '../../material/material.module';

const routes: Routes = [
  {path: '', redirectTo: 'pages/about-us'},
  {path: ':pageSlug', component: ExtraPageViewComponent}
];

@NgModule({
  declarations: [ExtraPageViewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PipesModule,
    MaterialModule,
  ]
})
export class ExtraPageViewModule { }

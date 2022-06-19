import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TestComponent} from './test.component';
import {RouterModule, Routes} from '@angular/router';
import {MaterialModule} from '../../material/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';

const routes: Routes = [
  {path: '', component: TestComponent},
  {path: ':catSlug/:subCatSlug', component: TestComponent},
];

@NgModule({
  declarations: [
    TestComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FlexLayoutModule
  ]
})
export class TestModule {
}

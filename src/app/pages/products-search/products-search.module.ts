import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {SharedModule} from '../../shared/shared.module';
import {ProductsSearchComponent} from './products-search.component';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {MaterialModule} from '../../material/material.module';

export const routes: Routes = [
  {path: ':search', component: ProductsSearchComponent, pathMatch: 'full'},
];

@NgModule({
  declarations: [ProductsSearchComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SharedModule,
    MaterialModule,
    PipesModule
  ]
})
export class ProductsSearchModule {
}

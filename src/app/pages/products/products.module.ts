import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {SharedModule} from '../../shared/shared.module';
import {ProductsComponent} from './products.component';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ProductCardOneModule} from '../../shared/lazy-component/product-card-one/product-card-one.module';
import {ProductCardTwoModule} from '../../shared/lazy-component/product-card-two/product-card-two.module';
import {MaterialModule} from '../../material/material.module';

export const routes = [
  {path: '', component: ProductsComponent, pathMatch: 'full'},
  {
    path: ':catSlug',
    component: ProductsComponent,
    data: {
      title: 'Categories',
      breadcrumb: [
        {
          label: 'Home',
          url: '/'
        },
        {
          label: '{{catSlug}}',// pageTwoID Parameter value will be add
          url: ''
        }
      ]
    },
  },
  {
    path: ':catSlug/:subCatSlug',
    component: ProductsComponent,
    data: {
      title: 'Sub Categories',
      breadcrumb: [
        {
          label: 'Home',
          url: '/'
        },
        {
          label: '{{catSlug}}',// pageTwoID Parameter value will be add
          url: '/products/:catSlug'
        },
        {
          label: '{{subCatSlug}}',// pageTwoID Parameter value will be add
          url: ''
        }
      ]
    }
  },
  {
    path: ':catSlug/:subCatSlug/:brandSlug',
    component: ProductsComponent,
    data: {
      title: 'Categories',
      breadcrumb: [
        {
          label: 'Home',
          url: '/'
        },
        {
          label: '{{catSlug}}',// pageTwoID Parameter value will be add
          url: '/products/:catSlug'
        },
        {
          label: '{{subCatSlug}}',// pageTwoID Parameter value will be add
          url: '/products/:catSlug/:subCatSlug'
        },
        {
          label: '{{brandSlug}}',// pageTwoID Parameter value will be add
          url: ''
        }
      ]
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SharedModule,
    PipesModule,
    ProductCardOneModule,
    ProductCardTwoModule,
    MaterialModule,
  ],
  declarations: [
    ProductsComponent,
  ]
})
export class ProductsModule {
}

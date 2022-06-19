import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { InputFileModule } from 'ngx-input-file';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductZoomComponent } from './product-detail/product-zoom/product-zoom.component';
import { AddProductComponent } from './add-product/add-product.component';
import { CategoriesComponent } from './categories/categories.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { CommonSharedModule } from './common/common-shared.module';
import { AddCategoryComponent } from './categories/add-category-dialog/add-category.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxMatTagInputModule } from 'ngx-mat-tag-input';
import { MatSelectFilterModule } from 'mat-select-filter';
import { OfferProductsComponent } from './offer-products/offer-products.component';
import { AddNewOfferProductComponent } from './offer-products/add-new-offer-product/add-new-offer-product.component';
import { AddOfferDialogComponent } from './offer-products/add-offer-dialog/add-offer-dialog.component';
import { BrandsComponent } from './brands/brands.component';
import { SubCategoriesComponent } from './sub-categories/sub-categories.component';
import { BrandDialogComponent } from './brands/brand-dialog/brand-dialog.component';
import { OfferPackageComponent } from './offer-package/offer-package.component';
import { AddOfferPackageComponent } from './offer-package/add-offer-package/add-offer-package.component';
import { EditSubCategoryComponent } from './sub-categories/edit-sub-category/edit-sub-category.component';
import { MaterialModule } from '../../../material/material.module';
import { SharedModule } from '../../../shared/shared.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { RatingModule } from '../../../shared/lazy-component/rating/rating.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SubCategoryDialogComponent } from './sub-categories/sub-category-dialog/sub-category-dialog.component';
import { ImageGalleryDialogModule } from '../gallery/image-gallery-dialog/image-gallery-dialog.module';
import { FeaturedCategoriesComponent } from './featured-categories/featured-categories.component';
import { FeaturedCategoriesDialogComponent } from './featured-categories/featured-categories-dialog/featured-categories-dialog.component';

export const routes = [
  { path: '', redirectTo: 'product-list', pathMatch: 'full' },
  {
    path: 'categories',
    component: CategoriesComponent,
    data: { breadcrumb: 'Categories' },
  },
  {
    path: 'categories/add',
    component: AddCategoryComponent,
    data: { breadcrumb: 'Add Category' },
  },
  {
    path: 'authors',
    component: BrandsComponent,
    data: { breadcrumb: 'Authors' },
  },
  {
    path: 'featured-categories',
    component: FeaturedCategoriesComponent,
    data: { breadcrumb: 'Featured Categories' },
  },
  {
    path: 'sub-categories',
    component: SubCategoriesComponent,
    data: { breadcrumb: 'Sub Categories' },
  },
  { path: 'sub-categories/add', component: SubCategoryDialogComponent },
  { path: 'sub-categories/edit/:id', component: EditSubCategoryComponent },
  {
    path: 'product-list',
    component: ProductListComponent,
    data: { breadcrumb: 'Product List' },
  },
  {
    path: 'product-detail',
    component: ProductDetailComponent,
    data: { breadcrumb: 'Product Detail' },
  },
  {
    path: 'product-detail/:id',
    component: ProductDetailComponent,
    data: { breadcrumb: 'Product Detail' },
  },
  {
    path: 'add-product',
    component: AddProductComponent,
    data: { breadcrumb: 'Add Product' },
  },
  // {path: 'add-product/:id', component: AddProductComponent, data: {breadcrumb: 'Add Product'}},
  {
    path: 'edit-product/:id',
    component: EditProductComponent,
    data: { breadcrumb: 'Edit Product' },
  },
  {
    path: 'offer-product',
    component: OfferProductsComponent,
    data: { breadcrumb: 'Offer Product' },
  },
  {
    path: 'offer-product/add-new',
    component: AddNewOfferProductComponent,
    data: { breadcrumb: 'Add Offer Product' },
  },
  {
    path: 'offer-package',
    component: OfferPackageComponent,
    data: { breadcrumb: 'Offer Package' },
  },
  {
    path: 'offer-package/add-new',
    component: AddOfferPackageComponent,
    data: { breadcrumb: 'Add Offer Package' },
  },
];

@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductZoomComponent,
    AddProductComponent,
    EditProductComponent,
    CategoriesComponent,
    AddCategoryComponent,
    BrandsComponent,
    BrandDialogComponent,
    SubCategoriesComponent,
    SubCategoryDialogComponent,
    OfferProductsComponent,
    AddNewOfferProductComponent,
    AddOfferDialogComponent,
    OfferPackageComponent,
    AddOfferPackageComponent,
    EditSubCategoryComponent,
    FeaturedCategoriesComponent,
    FeaturedCategoriesDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    AngularEditorModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    InputFileModule,
    DirectivesModule,
    FormsModule,
    CommonSharedModule,
    NgxMatTagInputModule,
    MatSelectFilterModule,
    PipesModule,
    RatingModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    ImageGalleryDialogModule,
  ],
})
export class ProductsModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidenavListComponent } from './components/sidenav-list/sidenav-list.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EditorAuthRoleGuard } from '../../auth-guard/editor-auth-role.guard';
import { ProductTableComponent } from './components/product-table/product-table.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductViewTableOneComponent } from './components/product-view-table-one/product-view-table-one.component';
import { AdminAuthRoleGuard } from '../../auth-guard/admin-auth-role.guard';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { MenuComponent } from './components/menu/menu.component';
import { FullScreenComponent } from './components/fullscreen/fullscreen.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'main-menu',
        loadChildren: () =>
          import('./menu-builder/menu-builder.module').then(
            (m) => m.MenuBuilderModule
          ),
        data: { breadcrumb: 'Main Menu' },
      },
      {
        path: 'customization',
        loadChildren: () =>
          import('./customization/customization.module').then(
            (m) => m.CustomizationModule
          ),
        data: { breadcrumb: 'Customization' },
      },
      {
        path: 'pages-info',
        loadChildren: () =>
          import('./page-info/page-info.module').then((m) => m.PageInfoModule),
        data: { breadcrumb: 'Page Info' },
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./products/products.module').then((m) => m.ProductsModule),
      },
      {
        path: 'sales',
        loadChildren: () =>
          import('./sales/sales.module').then((m) => m.SalesModule),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule),
        data: { breadcrumb: 'Users' },
      },
      {
        path: 'shipping-charge',
        loadChildren: () =>
          import('./shipping-charge/shipping-charge.module').then(
            (m) => m.ShippingChargeModule
          ),
      },
      {
        path: 'customers',
        loadChildren: () =>
          import('./customers/customers.module').then((m) => m.CustomersModule),
      },
      {
        path: 'coupons',
        loadChildren: () =>
          import('./coupons/coupons.module').then((m) => m.CouponsModule),
        data: { breadcrumb: 'Coupons' },
      },
      {
        path: 'refund',
        loadChildren: () =>
          import('./refund/refund.module').then((m) => m.RefundModule),
        data: { breadcrumb: 'Refund' },
      },
      {
        path: 'roles',
        canActivate: [AdminAuthRoleGuard],
        loadChildren: () =>
          import('./roles/roles.module').then((m) => m.RolesModule),
      },
      {
        path: 'my-profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'reviews',
        loadChildren: () =>
          import('./reviews/reviews.module').then((m) => m.ReviewsModule),
      },
      {
        path: 'offer-category-card',
        loadChildren: () =>
          import('./offer-category-card/offer-category-card.module').then(
            (m) => m.OfferCategoryCardModule
          ),
      },
      {
        path: 'promotional-offer',
        loadChildren: () =>
          import('./promotional-offer/promotional-offer.module').then(
            (m) => m.PromotionalOfferModule
          ),
      },
      {
        path: 'promotional-offer-product',
        loadChildren: () =>
          import(
            './promotional-offer-product/promotional-offer-product.module'
          ).then((m) => m.PromotionalOfferProductModule),
      },
      {
        path: 'backup-restore',
        loadChildren: () =>
          import('./backup-restore/backup-restore.module').then(
            (m) => m.BackupRestoreModule
          ),
        canActivate: [EditorAuthRoleGuard],
      },
      {
        path: 'featured-product',
        loadChildren: () =>
          import('./featured-product/featured-product.module').then(
            (m) => m.FeaturedProductModule
          ),
        canActivate: [EditorAuthRoleGuard],
      },
      {
        path: 'image-gallery',
        loadChildren: () =>
          import('./gallery/image-gallery/image-gallery.module').then(
            (m) => m.ImageGalleryModule
          ),
        canActivate: [EditorAuthRoleGuard],
      },
      {
        path: 'image-folder',
        loadChildren: () =>
          import('./gallery/image-folder/image-folder.module').then(
            (m) => m.ImageFolderModule
          ),
        canActivate: [EditorAuthRoleGuard],
      },
    ],
  },
];

@NgModule({
  declarations: [
    PagesComponent,
    HeaderComponent,
    SidenavListComponent,
    ProductTableComponent,
    ProductViewTableOneComponent,
    UserMenuComponent,
    MenuComponent,
    FullScreenComponent,
    BreadcrumbComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    RouterModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatListModule,
    MatNativeDateModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    PipesModule,
    FormsModule,
    NgxPaginationModule,
  ],
  exports: [ProductViewTableOneComponent],
  providers: [AdminAuthRoleGuard, EditorAuthRoleGuard],
})
export class PagesModule {}

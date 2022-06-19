import { NgModule } from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {PagesComponent} from './pages/pages.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {AdminAuthGuard} from './auth-guard/admin-auth.guard';
import {AdminAuthStateGuard} from './auth-guard/admin-auth-state.guard';
import {environment} from '../environments/environment';
import {UserAuthStateGuard} from './auth-guard/user-auth-state.guard';
import {UserAuthGuard} from './auth-guard/user-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
        data: { breadcrumb: 'Home' }
      },
      {
        path: 'registration',
        canActivate: [UserAuthStateGuard],
        loadChildren: () => import('./pages/user/registration/registration.module').then(m => m.RegistrationModule),
        data: {preload: false, delay: false}
      },
      {
        path: 'login',
        canActivate: [UserAuthStateGuard],
        loadChildren: () => import('./pages/user/login/login.module').then(m => m.LoginModule),
        data: {preload: false, delay: false}
      },
      {
        path: 'password-recovery',
        loadChildren: () => import('./pages/password-recovery/password-recovery.module').then(m => m.PasswordRecoveryModule),
        data: {preload: false, delay: true}
      },
      {
        path: 'account',
        canActivate: [UserAuthGuard],
        loadChildren: () => import('./pages/user/account/account.module').then(m => m.AccountModule),
        data: {preload: false, delay: false}
      },
      {
        path: 'cart',
        loadChildren: () => import('./pages/user/cart/cart.module').then(m => m.CartModule),
        data: {preload: false, delay: false}
      },
      {
        path: 'checkout',
        canActivate: [UserAuthGuard],
        loadChildren: () => import('./pages/user/checkout/checkout.module').then(m => m.CheckoutModule),
        data: {preload: false, delay: false}
      },
      {
        path:'new-checkout',
        loadChildren:() => import('./pages/user/new-checkout/new-checkout.module').then(m => m.NewCheckoutModule)
      },
      
      {
        path: 'auth-checkout',
       // canActivate: [UserAuthGuard],
        loadChildren: () => import('./pages/user/new-checkout/new-checkout.module').then(m => m.NewCheckoutModule),
        data: {preload: false, delay: false}
      },
      {
        path: 'products',
        loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsModule)
      },
      {
        path: 'product',
        loadChildren: () => import('./pages/product-details/product-details.module').then(m => m.ProductDetailsModule)
      },
      {
        path: 'offers',
        loadChildren: () => import('./pages/offers/offers.module').then(m => m.OffersModule)
      },
      {
        path: 'compare',
        loadChildren: () => import('./pages/compare/compare.module').then(m => m.CompareModule)
      },
      {
        path: 'pc-builder',
        loadChildren: () => import('./pages/pc-build/pc-build.module').then(m => m.PcBuildModule)
      },
      {
        path: 'information',
        loadChildren: () => import('./pages/offer-view/offer-view.module').then(m => m.OfferViewModule)
      },
      {
        path: 'pages',
        loadChildren: () => import('./pages/extra-page-view/extra-page-view.module').then(m => m.ExtraPageViewModule)
      },
      // { path: 'test', loadChildren: () => import('./pages/test/test.module').then(m => m.TestModule)},
      {
        path: 'products-search',
        loadChildren: () => import('./pages/products-search/products-search.module').then(m => m.ProductsSearchModule)
      },
      {
        path: 'payment',
        loadChildren: () => import('./pages/payment/payment.module').then(m => m.PaymentModule),
        data: {preload: true, delay: false}
      },
    ]
  },

  {
    path: 'test',
    loadChildren: () => import('./pages/test/test.module').then(m => m.TestModule)
  },
  // ADMIN
  {
    path: environment.adminLoginUrl,
    canActivate: [AdminAuthStateGuard],
    loadChildren: () => import('./admin/admin-auth/admin-auth.module').then(m => m.AdminAuthModule)
  },
  {
    path: environment.adminBaseUrl,
    canActivate: [AdminAuthGuard],
    loadChildren: () => import('./admin/pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: 'reset-password',
    canActivate: [AdminAuthStateGuard],
    loadChildren: () => import('./admin/pages/reset-password/reset-password.module').then(m => m.ResetPasswordModule)
  },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      preloadingStrategy: PreloadAllModules,
      // initialNavigation: 'enabled',
      anchorScrolling: 'enabled'
})
  ],
  providers: [UserAuthGuard, UserAuthStateGuard, AdminAuthGuard, AdminAuthStateGuard],
  exports: [RouterModule]
})
export class AppRoutingModule { }

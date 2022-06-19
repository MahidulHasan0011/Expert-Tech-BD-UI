import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {ConfirmDialogComponent} from './components/ui/confirm-dialog/confirm-dialog.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {SnackbarNotificationComponent} from './components/ui/snackbar-notification/snackbar-notification.component';
import {MessageDialogComponent} from './components/ui/message-dialog/message-dialog.component';
import {BreadcrumbComponent} from './breadcrumb/breadcrumb.component';
import {NgDynamicBreadcrumbModule} from 'ng-dynamic-breadcrumb';
import {CartViewDialogComponent} from './components/cart-view-dialog/cart-view-dialog.component';
import {PipesModule} from './pipes/pipes.module';
import {MaterialModule} from '../material/material.module';
import { ConfirmOrderComponent } from './dialog-view/confirm-order/confirm-order.component';
// import { FooterStickyComponent } from './components/footer-sticky/footer-sticky.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  suppressScrollX: true
};


@NgModule({
  declarations: [
    ConfirmDialogComponent,
    SnackbarNotificationComponent,
    MessageDialogComponent,
    BreadcrumbComponent,
    CartViewDialogComponent,
    ConfirmOrderComponent,
    // FooterStickyComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    PerfectScrollbarModule,
    NgxSpinnerModule,
    NgDynamicBreadcrumbModule,
    PipesModule,
    MaterialModule
  ],
  exports: [
    FlexLayoutModule,
    PerfectScrollbarModule,
    NgxSpinnerModule,
    MessageDialogComponent,
    NgDynamicBreadcrumbModule,
    CartViewDialogComponent
  ],
  providers: [
    {provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG}
  ],
  entryComponents: [SnackbarNotificationComponent]
})
export class SharedModule {
}

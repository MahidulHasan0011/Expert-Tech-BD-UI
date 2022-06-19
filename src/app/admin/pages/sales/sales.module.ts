import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';
import {OrdersComponent} from './orders/orders.component';
import {TransactionsComponent} from './transactions/transactions.component';
import {OrderDetailsComponent} from './orders/order-details/order-details.component';
import {UpdateOrderStatusComponent} from './orders/update-order-status/update-order-status.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPrintModule} from 'ngx-print';
import {PrintInvoiceComponent} from './orders/order-details/print-invoice/print-invoice.component';
import {MaterialModule} from "../../../material/material.module";
import {SharedModule} from "../../../shared/shared.module";
import {PipesModule} from "../../../shared/pipes/pipes.module";
import { PrintInvoiceOneComponent } from './orders/order-details/print-invoice-one/print-invoice-one.component';


export const routes = [
  {path: '', redirectTo: 'orders', pathMatch: 'full'},
  {path: 'orders', component: OrdersComponent, data: {breadcrumb: 'Orders'}},
  {path: 'orders/details/:id', component: OrderDetailsComponent, data: {breadcrumb: 'Orders'}},
  {path: 'transactions', component: TransactionsComponent, data: {breadcrumb: 'Transactions'}},
];

@NgModule({
  declarations: [
    OrdersComponent,
    TransactionsComponent,
    OrderDetailsComponent,
    UpdateOrderStatusComponent,
    PrintInvoiceComponent,
    PrintInvoiceOneComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    SharedModule,
    NgxPaginationModule,
    PipesModule,
    NgxPrintModule,
  ]
})
export class SalesModule {
}

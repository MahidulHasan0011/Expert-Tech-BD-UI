import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardComponent } from './dashboard.component';
import { TilesComponent } from './tiles/tiles.component';
import { InfoCardsComponent } from './info-cards/info-cards.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { MontlySalesComponent } from './montly-sales/montly-sales.component';
import { LatestOrdersComponent } from './latest-orders/latest-orders.component';
import {SharedModule} from "../../../shared/shared.module";
import {MaterialModule} from "../../../material/material.module";

export const routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    DashboardComponent,
    TilesComponent,
    InfoCardsComponent,
    AnalyticsComponent,
    MontlySalesComponent,
    LatestOrdersComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MaterialModule,
    NgxChartsModule
  ]
})
export class DashboardModule { }

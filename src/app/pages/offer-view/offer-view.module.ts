import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OfferViewComponent} from './offer-view.component';
import {RouterModule, Routes} from '@angular/router';
import {OfferDetailsComponent} from './offer-details/offer-details.component';
import {SharedModule} from '../../shared/shared.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {MaterialModule} from '../../material/material.module';

const routes: Routes = [
  {path: '', redirectTo: 'offers', pathMatch: 'full'},
  {
    path: 'offers',
    component: OfferViewComponent,
    data: {
      title: 'offers'
    }
  },
  {
    path: 'offers/:id',
    component: OfferDetailsComponent
  }
];

@NgModule({
  declarations: [OfferViewComponent, OfferDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    PipesModule,
    MaterialModule,
  ]
})
export class OfferViewModule {
}

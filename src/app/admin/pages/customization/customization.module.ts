import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryCarouselComponent } from './primary-carousel/primary-carousel.component';
import { RouterModule, Routes } from '@angular/router';
import { ContactInformationComponent } from './contact-information/contact-information.component';
import { AddCarouselComponent } from './primary-carousel/add-carousel/add-carousel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OfferTabComponent } from './offer-tab/offer-tab.component';
import { AddOfferTabComponent } from './offer-tab/add-offer-tab/add-offer-tab.component';
import { TabLabelDialogComponent } from './offer-tab/tab-label-dialog/tab-label-dialog.component';
import { OfferBannerComponent } from './offer-banner/offer-banner.component';
import { AddOfferBannerComponent } from './offer-banner/add-offer-banner/add-offer-banner.component';
import { BranchComponent } from './branch/branch.component';
import { AddNewBranchComponent } from './branch/add-new-branch/add-new-branch.component';
import { MaterialModule } from '../../../material/material.module';
import { SharedModule } from '../../../shared/shared.module';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxPaginationModule } from 'ngx-pagination';

const routes: Routes = [
  { path: '', redirectTo: 'primary-carousel' },
  { path: 'primary-carousel', component: PrimaryCarouselComponent },
  { path: 'primary-carousel/add-new', component: AddCarouselComponent },
  { path: 'primary-carousel/add-new/:id', component: AddCarouselComponent },
  { path: 'offer-tabs', component: OfferTabComponent },
  { path: 'offer-tabs/add-new', component: AddOfferTabComponent },
  { path: 'contact-info', component: ContactInformationComponent },
  { path: 'branch', component: BranchComponent },
  { path: 'offer-banner', component: OfferBannerComponent },
  { path: 'offer-banner/add-new', component: AddOfferBannerComponent },
];

@NgModule({
  declarations: [
    PrimaryCarouselComponent,
    ContactInformationComponent,
    AddCarouselComponent,
    OfferTabComponent,
    AddOfferTabComponent,
    TabLabelDialogComponent,
    OfferBannerComponent,
    AddOfferBannerComponent,
    BranchComponent,
    AddNewBranchComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    MatProgressSpinnerModule,
    NgxPaginationModule,
  ],
})
export class CustomizationModule {}

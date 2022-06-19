import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {SliderBigBannerModule} from '../../shared/lazy-component/slider-big-banner/slider-big-banner.module';
import {SwiperModule} from 'swiper/angular';
import {ProductCardOneModule} from '../../shared/lazy-component/product-card-one/product-card-one.module';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {MaterialModule} from '../../material/material.module';
import {ProductCardOfferModule} from "../../shared/lazy-component/product-card-offer/product-card-offer.module";

const routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [HomeComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule,
        PipesModule,
        SliderBigBannerModule,
        SwiperModule,
        ProductCardOneModule,
        LazyLoadImageModule,
        MaterialModule,
        ProductCardOfferModule,
    ]
})
export class HomeModule { }

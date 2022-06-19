import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderBigBannerComponent } from './slider-big-banner.component';
import {SwiperModule} from 'swiper/angular';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [
    SliderBigBannerComponent
  ],
    imports: [
        CommonModule,
        SwiperModule,
        LazyLoadImageModule,
        RouterModule
    ],
  exports: [
    SliderBigBannerComponent
  ]
})
export class SliderBigBannerModule { }

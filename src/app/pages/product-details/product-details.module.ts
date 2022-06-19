import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailsComponent } from './product-details.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ProductZoomComponent } from './product-zoom/product-zoom.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { RatingAndReviewComponent } from './rating-and-review/rating-and-review.component';
import { YoutubeVideoModule } from 'src/app/shared/lazy-component/youtube-video/youtube-video.module';
import { SwiperModule } from 'swiper/angular';
import { ProductCardOneModule } from '../../shared/lazy-component/product-card-one/product-card-one.module';
import { StarRatingModule } from '../../shared/lazy-component/star-rating/star-rating.module';
import { RatingModule } from '../../shared/lazy-component/rating/rating.module';
import { MaterialModule } from '../../material/material.module';

const routes: Routes = [
  {
    path: ':slug',
    component: ProductDetailsComponent,
    data: {
      title: 'Product Details',
    },
  },
];

@NgModule({
  declarations: [
    ProductDetailsComponent,
    ProductZoomComponent,
    RatingAndReviewComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    PipesModule,
    YoutubeVideoModule,
    SwiperModule,
    ProductCardOneModule,
    StarRatingModule,
    MaterialModule,
    RatingModule,
  ],
})
export class ProductDetailsModule {}

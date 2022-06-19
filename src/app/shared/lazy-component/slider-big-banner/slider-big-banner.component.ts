import {Component, Input, OnInit} from '@angular/core';
import {Carousel} from '../../../interfaces/carousel';
import SwiperCore, {
  Pagination,
  Autoplay
} from 'swiper/core';

// install Swiper modules
SwiperCore.use([Pagination, Autoplay]);

@Component({
  selector: 'app-slider-big-banner',
  templateUrl: './slider-big-banner.component.html',
  styleUrls: ['./slider-big-banner.component.scss']
})
export class SliderBigBannerComponent implements OnInit {

  @Input() carousels: Carousel[] = [];

  constructor() { }

  ngOnInit(): void {
  }


}

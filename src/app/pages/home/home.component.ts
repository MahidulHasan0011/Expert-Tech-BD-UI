import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ShopService } from '../../services/shop.service';
import { OfferTab } from '../../interfaces/offer-tab';
import { Product } from '../../interfaces/product';
import { ContactInfo } from '../../interfaces/contact-info';
import { forkJoin } from 'rxjs';
import { OfferBanner } from '../../interfaces/offer-banner';
import { Carousel } from '../../interfaces/carousel';
import { OfferBannerCard } from '../../interfaces/offer-banner-card';
import SwiperCore, { Navigation } from 'swiper/core';
import { Pagination } from '../../interfaces/pagination';
import { FeaturedProduct } from '../../interfaces/featured-product';
import { FeaturedProductService } from '../../services/featured-product.service';
import { OfferCategoryCard } from '../../interfaces/offer-category-card';
import { OfferCategoryCardService } from '../../services/offer-category-card.service';
import { ReloadService } from '../../services/reload.service';
import { FacebookService, InitParams } from 'ngx-facebook';
import { Router } from '@angular/router';

// install Swiper modules
SwiperCore.use([Navigation]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public featuredCategory: any[] = [];
  allOfferCategoryCard: OfferCategoryCard[] = [];

  carousels: Carousel[] = [{ image: null, priority: null, url: '/' }];

  offerBannerCards: OfferBannerCard[] = [];
  offerBanners: OfferBanner[] = [];
  tabData: OfferTab[] = [];
  offerProductsNew: Product[] = [];
  offerProductsFlash: Product[] = [];
  contactInfoData: ContactInfo = null;
  allFeaturedProduct: FeaturedProduct[] = [];

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private shopService: ShopService,
    private offerCategoryCardService: OfferCategoryCardService,
    private reloadService: ReloadService,
    private featuredProductService: FeaturedProductService,
    // private facebookService: FacebookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let currentUrl = this.router.url;
    console.log("home", currentUrl)


    this.reloadService.refreshPromotionalOffer$.subscribe(() => {
      this.getAllOfferCategoryCard();
    });
    this.getAllOfferCategoryCard();
    this.getAllCarousel();
    this.getAllOfferBannerCard();
    this.getAllOfferBanner();
    this.getContactInfo();
    this.getAllOfferProductFlash();
    this.getAllFeaturedProduct();
    this.getFeaturedCategoryList();
    // Init Facebook Service
    // this.initFacebookService();
  }

  /**
   * HTTP REQ HANDLE
   */
  private getAllCarousel() {
    this.shopService.getAllCarousel('image url priority -_id').subscribe(
      (res) => {
        this.carousels = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getAllOfferBannerCard() {
    const pagination: Pagination = {
      pageSize: '1',
      currentPage: '2 ',
    };
    this.shopService
      .getAllOfferBannerCard(pagination, 'image url -_id')
      .subscribe(
        (res) => {
          this.offerBannerCards = res.data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  private getAllOfferBanner() {
    this.shopService.getAllOfferBanner('priority image url -_id').subscribe(
      (res) => {
        this.offerBanners = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  private getAllOfferCategoryCard() {
    this.offerCategoryCardService.getAllOfferCategoryCard().subscribe(
      (res) => {
        this.allOfferCategoryCard = res.data;
        console.log(res.data);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllOfferProductNew() {
    this.shopService.getQueryOfferProduct('new-arrival').subscribe(
      (res) => {
        this.offerProductsNew = res.data.map((m) => {
          return m?.product as Product;
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getAllOfferProductFlash() {
    this.shopService.getQueryOfferProduct('flash-sale').subscribe(
      (res) => {
        this.offerProductsFlash = res.data.map((m) => {
          return m?.product as Product;
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getAllFeaturedProduct() {
    this.featuredProductService.getAllFeaturedProduct().subscribe(
      (res) => {
        this.allFeaturedProduct = res.data;
        console.log(this.allFeaturedProduct);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getContactInfo() {
    this.shopService.getContactInfo('notification -_id').subscribe(
      (res) => {
        this.contactInfoData = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private parallelHttpReq() {
    const newArrival = this.shopService.getQueryOfferProduct('new-arrival');
    const flashSale = this.shopService.getQueryOfferProduct('flash-sale');
    forkJoin([newArrival, flashSale]).subscribe((results) => {
      this.offerProductsNew = results[0].data.map((m) => {
        if (m.product !== null) {
          return m.product as Product;
        }
      });
      this.offerProductsFlash = results[1].data.map((m) => {
        if (m.product !== null) {
          return m.product as Product;
        }
      });
    });
  }

  private getFeaturedCategoryList() {
    this.productService.getAllFeaturedCategoryList().subscribe(
      (res) => {
        this.featuredCategory = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onLinkClick(event: MatTabChangeEvent) {}

    /**
   * INIT FACEBOOK
   */
    //  private initFacebookService(): void {
    //   const initParams: InitParams = {xfbml: true, version: 'v11.0'};
    //   this.facebookService.init(initParams);
    // }
}

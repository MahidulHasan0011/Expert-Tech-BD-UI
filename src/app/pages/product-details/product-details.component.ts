import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { NgDynamicBreadcrumbService } from 'ng-dynamic-breadcrumb';
import { ImageFormat, Product } from '../../interfaces/product';
import { FormGroup } from '@angular/forms';
import { Cart } from '../../interfaces/cart';
import { ContactInfo } from '../../interfaces/contact-info';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserDataService } from '../../services/user-data.service';
import { ReloadService } from '../../services/reload.service';
import { ShopService } from '../../services/shop.service';
import { OfferBannerCard } from '../../interfaces/offer-banner-card';
import { UiService } from '../../services/ui.service';
import { UserService } from '../../services/user.service';
import { ProductZoomComponent } from './product-zoom/product-zoom.component';
import { WishlistSchema } from '../../interfaces/wishlist';
import { Review } from '../../interfaces/review';
import { ReviewControl } from '../../interfaces/review-control';
import { CartService } from '../../services/cart.service';
import { ReviewControlService } from '../../services/review-control.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  @ViewChild('zoomViewer', { static: true }) zoomViewer;
  public product: Product = null;
  public image: any;
  public zoomImage: any;
  private sub: any;
  public form: FormGroup;
  public relatedProducts: Product[] = [];
  offerBannerCards: OfferBannerCard[] = [];

  // Reviews
  allReviews: ReviewControl[] = [];

  // Check
  checked = false;

  // Quantity
  selectedQty = 1;

  // CARTS
  carts: Cart[] = [];
  existsInCart = false;

  // Contact Info
  contactInfoData: ContactInfo = null;

  pageUrl: string = null;
  reviews: Review[] = [];

  //Share In Buttons
  // @ViewChildren('social-buttons')
  // @ViewChildren('twitter-btn')
  // public socialBtn!: QueryList<ElementRef<HTMLLIElement>>;
  // public twitterBtn!: QueryList<ElementRef<HTMLLIElement>>;
  @ViewChild('mylink') link: ElementRef;
  public href: string = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog,
    private reloadService: ReloadService,
    private uiService: UiService,
    private ngDynamicBreadcrumbService: NgDynamicBreadcrumbService,
    private cartService: CartService,
    private reviewControlService: ReviewControlService,
    private shopService: ShopService,
    private userDataService: UserDataService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private elem: ElementRef,
    @Inject(PLATFORM_ID) public platformId: any
  ) {}

  ngOnInit() {
    this.sub = this.route.paramMap.subscribe((params) => {
      this.getProductBySlug(params.get('slug'));
    });

    this.reloadService.refreshCart$.subscribe(() => {
      this.getCartsItems();
    });

    this.getAllOfferBannerCard();

    this.getContactInfo();
    this.shareInButton();
    this.href = this.router.url;
    console.log('url: ', this.router.url);
    console.log(this.elem.nativeElement.location.href);
  }
  public ngAfterViewInit() {
    let facebookBtn = this.elem.nativeElement.querySelector('.facebook-btn');
    let twitterBtn = this.elem.nativeElement.querySelector('.twitter-btn');

    let postUrl = encodeURI(this.elem.nativeElement.location.href);
    let postTitle = encodeURI(this.elem.nativeElement.querySelector('.name'));
    const postImg = this.elem.nativeElement.querySelector('.share-img');
    const postImgSrc = encodeURI(postImg.src);

    // console.log('Href: ', encodeURI(this.elem.nativeElement.location.href));
    facebookBtn.setAttribute(
      this.elem.nativeElement,
      'xlink:href',
      `https://www.facebook.com/sharer.php?u=${postUrl}`
    );
    this.link.nativeElement.href = 'microsoft.com';
    this.shareInButton();
  }

  public shareInButton() {
    let facebookBtn = this.elem.nativeElement.querySelector('.facebook-btn');
    let twitterBtn = this.elem.nativeElement.querySelector('.twitter-btn');

    let postUrl = encodeURI(this.elem.nativeElement.location.href);
    let postTitle = encodeURI(this.elem.nativeElement.querySelector('.name'));
    const postImg = this.elem.nativeElement.querySelector('.share-img');
    const postImgSrc = encodeURI(postImg.src);

    facebookBtn.setAttribute(
      this.elem.nativeElement,
      'xlink:href',
      `https://www.facebook.com/sharer.php?u=${postUrl}`
    );
    this.link.nativeElement.href = 'microsoft.com';

    this.href = this.router.url;
    console.log('url: ', this.router.url);
    console.log(this.elem.nativeElement.location.href);
  }

  public getProductBySlug(slug: string) {
    this.spinner.show();

    this.productService.getProductBySlug(slug).subscribe(
      (res) => {
        this.product = res.data;
        console.log(this.product);
        if (this.product) {
          this.updateBreadcrumb();
          this.setDefaultImage();
          this.getRelatedProducts();
          this.pageUrl = '/product/' + this.product.slug;
          // setTimeout(() => {
          //   this.config.observer = true;
          // });
          this.getCartsItems();
          this.getAllReviewsByQuery();
          this.spinner.hide();
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  /**
   * Breadcrumb CUSTOM
   */
  private updateBreadcrumb(): void {
    const breadcrumbs = [
      {
        label: 'Home',
        url: '/',
      },
      {
        label: this.product?.categorySlug,
        url: `/products/${this.product.categorySlug}`,
      },
      {
        label: this.product?.subCatName,
        url: `/products/${this.product.categorySlug}/${this.product.subCatSlug}`,
      },
      {
        label: this.product?.brandName,
        url: `/products/${this.product.categorySlug}/${this.product.subCatSlug}/${this.product.brandSlug}`,
      },
      {
        label: this.product?.name,
        url: '',
      },
    ];
    this.ngDynamicBreadcrumbService.updateBreadcrumb(breadcrumbs);
  }

  private setDefaultImage() {
    // if (this.product.images && this.product.images.length) {
    //   this.image =
    //     this.product.images !== null
    //       ? this.product.images[0].medium
    //       : '/assets/images/png/image-placeholder-big-r1.png';
    //   if (this.product.images && this.product.images.length) {
    //     this.zoomImage = this.product.images[0].big;
    //   }
    // } else {
    //   this.image =
    //     this.product.productImages !== null
    //       ? this.product.productImages[0]
    //       : '/assets/images/png/image-placeholder-big-r1.png';
    //   if (this.product.productImages && this.product.productImages.length) {
    //     this.zoomImage = this.product.productImages[0];
    //   }
    // }

    if (this.product.productImages && this.product.productImages.length) {
      this.image = this.product.productImages[0];
      this.zoomImage = this.product.productImages[0];
    } else if (this.product.images && this.product.images.length) {
      this.image = this.product.images[0].big
      this.zoomImage = this.product.images[0].big;
    } else {
      this.image = '/assets/images/png/image-placeholder-big-r1.png';
      this.zoomImage = '/assets/images/png/image-placeholder-big-r1.png';

    }
  }

  public selectImage(image: any) {
    console.log(image);
    this.image = image;
    this.zoomImage = image;
  }

  public onMouseMove(e) {
    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth >= 1099) {
        const image = e.currentTarget;
        const offsetX = e.offsetX;
        const offsetY = e.offsetY;
        const x = (offsetX / image.offsetWidth) * 100;
        const y = (offsetY / image.offsetHeight) * 100;
        const zoom = this.zoomViewer.nativeElement.children[0];
        if (zoom) {
          zoom.style.backgroundPosition = x + '% ' + y + '%';
          zoom.style.display = 'block';
          zoom.style.height = image.height + 'px';
          zoom.style.width = image.width + 'px';
        }
      }
    }
  }

  public onMouseLeave(event) {
    this.zoomViewer.nativeElement.children[0].style.display = 'none';
  }

  public openZoomViewer(imgBig: any) {
    this.dialog.open(ProductZoomComponent, {
      data: imgBig,
      panelClass: 'zoom-dialog',
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllReviewsByQuery() {
    const query = {
      product: this.product._id,
      status: true,
    };
    this.reviewControlService.getAllReviewsByQuery(null, null, query).subscribe(
      (res) => {
        this.allReviews = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getRelatedProducts() {
    const data = {
      // @ts-ignore
      category: this.product.category._id,
      // @ts-ignore
      subCategory: this.product.subCategory._id,
      id: this.product._id,
    };
    this.productService.getRelatedProducts(data).subscribe(
      (res) => {
        this.relatedProducts = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getContactInfo() {
    this.shopService.getContactInfo().subscribe(
      (res) => {
        this.contactInfoData = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addItemToCartDB(data: Cart) {
    this.userDataService.addItemToUserCart(data).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshCart$();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getAllOfferBannerCard() {
    this.shopService.getAllOfferBannerCard().subscribe(
      (res) => {
        this.offerBannerCards = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   * QUANTITY CONTROL
   */

  incrementQty() {
    this.selectedQty += 1;
  }

  decrementQty() {
    if (this.selectedQty === 1) {
      this.uiService.warn('Minimum Quantity is selected');
      return;
    }
    this.selectedQty -= 1;
  }

  /**
   * CART FUNCTIONALITY
   */

  addToCart() {
    const data: Cart = {
      product: this.product?._id,
      selectedQty: this.selectedQty,
    };

    if (this.userService.getUserStatus()) {
      this.addItemToCartDB(data);
    } else {
      this.cartService.addCartItemToLocalStorage(data);
      this.reloadService.needRefreshCart$();
    }
  }

  // GET CARTS DATA
  private getCartsItems() {
    if (this.userService.getUserStatus()) {
      this.getCartItemList();
    } else {
      this.getCarsItemFromLocal();
    }
  }

  private getCartItemList() {
    this.cartService.getCartItemList().subscribe(
      (res) => {
        this.carts = res.data;
        // @ts-ignore
        const existsOnCart = this.carts.find(
          (item) => item.product._id === this.product._id
        );
        if (existsOnCart) {
          this.existsInCart = true;
          this.selectedQty = existsOnCart.selectedQty;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getCarsItemFromLocal() {
    const items = this.cartService.getCartItemFromLocalStorage();

    if (items && items.length > 0) {
      const ids: string[] = items.map((m) => m.product as string);
      this.productService
        .getSpecificProductsById(
          ids,
          'name slug salePrice discount quantity images productImages'
        )
        .subscribe((res) => {
          const products = res.data;
          if (products && products.length > 0) {
            this.carts = items.map((t1) => ({
              ...t1,
              ...{ product: products.find((t2) => t2._id === t1.product) },
            }));
            // @ts-ignore
            const existsOnCart = this.carts.find(
              (item) => item.product._id === this.product._id
            );
            if (existsOnCart) {
              this.existsInCart = true;
              this.selectedQty = existsOnCart.selectedQty;
            }
          }
        });
    } else {
      this.carts = [];
    }
  }

  /**
   * COMPARE
   */

  addToCompare() {
    this.productService.addToCompare(this.product);
    this.reloadService.needRefreshCompareList$();
  }

  /**
   * HTTP REQ HANDLE AND ONCLICK CHECK AND CALL ADD TO WISHLIST
   */

  addItemToWishlistDB(data: WishlistSchema) {
    this.userDataService.addSingleItemToWishlist(data).subscribe(
      (res) => {
        this.uiService.success(res.message);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ifLoggedIn() {
    return this.userService.getUserStatus();
  }

  addToWishlistItemAfterCheck() {
    this.userDataService
      .checkStatusInWishlistWithBookId(this.product._id)
      .subscribe(
        (res) => {
          // const count = res.data;
          const exists = res.exists;

          if (this.userService.getUserStatus()) {
            // if (count === 0) {
            if (!exists) {
              const data: WishlistSchema = {
                product: this.product?._id,
              };
              this.addItemToWishlistDB(data);
            } else {
              // WARNING MESSAGE FOR REGISTERED USER THAT ITEM ALREADY EXISTS
              this.uiService.warn(res.message);
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
}

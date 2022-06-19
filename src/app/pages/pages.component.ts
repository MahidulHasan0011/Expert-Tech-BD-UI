import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import {SidenavMenu} from '../interfaces/sidenav-menu';
import {sidenavMenuItems} from '../core/menu/sidenav-menu/sidenav-menu';
import {NgForm} from '@angular/forms';
import {isPlatformBrowser} from '@angular/common';
import {debounceTime, distinctUntilChanged, pluck, switchMap} from 'rxjs/operators';
import {EMPTY} from 'rxjs';
import {ProductService} from '../services/product.service';
import {Router} from '@angular/router';
import {UserDataService} from '../services/user-data.service';
import {ReloadService} from '../services/reload.service';
import {UserService} from '../services/user.service';
import {ShopService} from '../services/shop.service';
import {Product} from '../interfaces/product';
import {ContactInfo} from '../interfaces/contact-info';
import {User} from '../interfaces/user';
import {UiService} from '../services/ui.service';
import {Menu} from '../interfaces/menu';
import {MenuService} from '../services/menu.service';
import {Cart} from '../interfaces/cart';
import {CartService} from '../services/cart.service';
import {SortPipe} from '../shared/pipes/sort.pipe';
import {PromotionalOffer} from "../interfaces/promotional-offer";
import {PromotionalOfferService} from "../services/promotional-offer.service";

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  providers: [SortPipe]
})
export class PagesComponent implements OnInit, AfterViewInit {

  menuItem2 = [];


  menuList: Menu[] = [];


  // User Data
  user: User = null;
  isUserAuth = false;

  sidenavMenuItems: SidenavMenu[] = [];
  @ViewChild('searchForm') searchForm: NgForm;
  scrollPosition = 0;
  isUserLoggedIn = false;

  contactInfoData: ContactInfo = null;
  addressLines: string[] = [];
  searchProducts: Product[] = [];

  // CARTS
  carts: Cart[];
  cartsItemsCount = 0;

  compareItemsCount = 0;

  // SEARCH AREA
  overlay = false;
  isOpen = false;
  isFocused = false;
  isLoading = false;
  isSelect = false;
  query = null;
  @ViewChild('searchInput') searchInput: ElementRef;

  showSearch = false;

  searchString = '';

  // searchParam = {query: this.searchString};
  @ViewChild('sidenav') sidenav: any;

  /**
   *
   */

  @HostListener('mousewheel', ['$event']) onMouseWheelChrome(event: any) {
    this.disableScroll(event);
  }

  @HostListener('DOMMouseScroll', ['$event']) onMouseWheelFirefox(event: any) {
    this.disableScroll(event);
  }

  @HostListener('onmousewheel', ['$event']) onMouseWheelIE(event: any) {
    this.disableScroll(event);
  }


  disableScroll(event: any) {
    if (event.srcElement.type === 'number') {
      event.preventDefault();
    }

  }

  promotionalOffers: PromotionalOffer[] = [];

  constructor(
    private productService: ProductService,
    public router: Router,
    private userDataService: UserDataService,
    public userService: UserService,
    private reloadService: ReloadService,
    private shopService: ShopService,
    private uiService: UiService,
    private menuService: MenuService,
    private cartService: CartService,
    private sortPipe: SortPipe,
    private promotionalOfferService: PromotionalOfferService,
    @Inject(PLATFORM_ID) public platformId: any
  ) {
    // window.addEventListener('scroll', this.scrolling, true);
  }

  ngOnInit(): void {
    this.sidenavMenuItems = sidenavMenuItems;
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('scroll', this.scrolling, true);
    }

    this.getContactInfo();
    this.getAllMenu();

    this.userService.getUserStatusListener().subscribe(() => {
      this.isUserAuth = this.userService.getUserStatus();
      if (this.isUserAuth) {
        this.getLoggedInUserInfo();
      }
    });
    this.isUserAuth = this.userService.getUserStatus();
    if (this.isUserAuth) {
      this.getLoggedInUserInfo();
    }

    // CART FUNCTION
    this.reloadService.refreshCart$.subscribe(() => {
      this.getCartsItems(true);
    });
    this.getCartsItems();

    this.reloadService.refreshCompareList$.subscribe(() => {
      this.getCompareList();
    });
    this.getCompareList();

    this.menuService.refreshMenu$.subscribe(() => {
      this.sidenav.close();
    });

    this.getAllPromotionalOffer();

    // this.reloadService.refreshUser$.subscribe(() => {
    //   console.log('Iam Here in refresh user');
    //   this.getLoggedInUserData();
    // });
  }

  // Scroll Control
  private scrolling = () => {
    this.scrollPosition = window.pageYOffset
      || document.documentElement.scrollTop
      || document.body.scrollTop || 0;

    // console.log(this.scrollPosition);
  }

  ngAfterViewInit(): void {
    const formValue = this.searchForm.valueChanges;

    formValue.pipe(
      // map(t => t.searchTerm)
      // filter(() => this.searchForm.valid),
      pluck('searchTerm'),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(data => {
        this.query = data;
        if (this.query === '' || this.query === null) {
          this.overlay = false;
          this.searchProducts = [];
          this.query = null;
          return EMPTY;
        }
        this.isLoading = true;
        return this.productService.getSearchProduct(data, {pageSize: 10, currentPage: 1}, '0');
      })
    )
      .subscribe(res => {
        this.isLoading = false;
        this.searchProducts = res.data;
        if (this.searchProducts.length > 0) {
          this.isOpen = true;
          this.overlay = true;
        }
      }, error => {
        this.isLoading = false;
      });
  }

  /**
   * HANDLE SEARCH
   * OVERLAY
   * SELECT
   */

  handleKeyUp(event) {
    if (event.keyCode === 13) {
      this.onSubmitSearch();
    }
  }

  onSubmitSearch() {
    this.isOpen = false;
    this.overlay = false;
    this.searchInput.nativeElement.value = '';
    this.router.navigate(['/products-search', this.searchString]);
  }

  onClickHeader(): void {
    this.handleCloseOnly();
  }

  onClickSearchArea(event: MouseEvent): void {
    event.stopPropagation();
  }


  handleOverlay(): void {
    this.overlay = false;
    this.isOpen = false;
    this.isFocused = false;
  }

  handleFocus(event: FocusEvent): void {
    this.searchInput.nativeElement.focus();

    if (this.isFocused) {
      return;
    }
    if (this.searchProducts.length > 0) {
      this.setPanelState(event);
    }
    this.isFocused = true;
  }


  private setPanelState(event: FocusEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.isOpen = false;
    this.handleOpen();
  }


  handleOpen(): void {
    if (this.isOpen || this.isOpen && !this.isLoading) {
      return;
    }
    if (this.searchProducts.length > 0) {
      this.isOpen = true;
      this.overlay = true;
    }
  }

  handleCloseOnly(): void {
    if (!this.isOpen) {
      this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.isFocused = false;
  }

  handleCloseAndClear(): void {
    if (!this.isOpen) {
      this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.searchProducts = [];
    this.isFocused = false;
  }


  onSelectItem(data: Product): void {
    this.handleCloseAndClear();
    this.router.navigate(['/product', data.slug]);
  }

  /**
   * HTTP REQ HANDLE
   * LOCAL STORAGE HANDLE
   */

  private getAllMenu() {
    this.shopService.getAllMenu()
      .subscribe(res => {
        this.menuList = res.data;
        this.convertForMobileMenu();
      }, error => {
        console.log(error);
      });
  }


  public getContactInfo() {
    this.shopService.getContactInfo()
      .subscribe(res => {
        this.contactInfoData = res.data;
        this.addressLines = res.data?.addressLines;
      }, error => {
        console.log(error);
      });
  }


  /**
   * COMPARE
   */
  getCompareList() {
    this.compareItemsCount = this.productService.getCompareList().length;
  }

  /**
   * SCROLL
   */

  disableScrolling() {
    // console.log('Iam Here in disable scroll');
    // const x = window.scrollX;
    // const y = window.scrollY;
    // window.onscroll = () => {
    //   window.scrollTo(x, y);
    // };
  }

  enableScrolling() {
    // window.onscroll = () => {
    // };
  }

  /**
   * LOGGED IN USER DATA
   */

  /**
   * HTTP REQ HANDLE
   */

  private getLoggedInUserInfo() {
    const select = 'fullName';
    this.userDataService.getLoggedInUserInfo(select)
      .subscribe(res => {
        this.user = res.data;
      }, error => {
        console.log(error);
      });
  }

  /**
   * CART DATA
   */
  private getCartsItems(refresh?: boolean) {
    if (this.userService.getUserStatus()) {
      this.cartService.getCartItemList()
        .subscribe(res => {
          this.carts = res.data;
        });
    } else {
      this.getCarsItemFromLocal(refresh);
    }

  }

  private getCarsItemFromLocal(refresh?: boolean) {
    const items = this.cartService.getCartItemFromLocalStorage();

    if (items && items.length > 0) {
      const ids: string[] = items.map(m => m.product as string);
      this.productService.getSpecificProductsById(ids, 'name slug salePrice discount quantity images')
        .subscribe(res => {
          const products = res.data;
          if (products && products.length > 0) {
            this.carts = items.map(t1 => ({...t1, ...{product: products.find(t2 => t2._id === t1.product)}}));
          }
        });
    } else {
      this.carts = [];
    }
  }


  convertForMobileMenu() {
    const menuListP = this.sortPipe.transform(this.menuList, 'priority');

    this.menuItem2 = menuListP.map(m => {
      return {
        id: m.categoryId,
        name: m.categoryName,
        slug: m.slug,
        depth: 1,
        routerLink: `/products/${m.slug}`,
        hasChild: m.subCategories.map(m2 => {
          return {
            id: m2.subCatId,
            name: m2.subCatName,
            slug: m2.slug,
            depth: 2,
            routerLink: `/products/${m.slug}/${m2.slug}`,
            hasChild: m2.brands.map(m3 => {
              return {
                id: m3.brandId,
                name: m3.brandName,
                slug: m3.slug,
                depth: 3,
                routerLink: `/products/${m.slug}/${m2.slug}/${m3.slug}`,
                hasChild: []
              };
            })
          };
        })
      };
    });
  }

  private getAllPromotionalOffer() {
    this.promotionalOfferService.getAllPromotionalOffer()
      .subscribe(res => {
        this.promotionalOffers = res.data;
        console.log(res.data);
      }, err => {
        console.log(err);
      });
  }

}

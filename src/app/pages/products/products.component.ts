import {Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../services/product.service';
import {Product} from '../../interfaces/product';
import {Subscription} from 'rxjs';
import {LocalStorageService} from '../../services/local-storage.service';
import {ReloadService} from '../../services/reload.service';
import {UserCartDB} from '../../interfaces/user-cart';
import {UserDataService} from '../../services/user-data.service';
import {UiService} from '../../services/ui.service';
import {UserService} from '../../services/user.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {MatSliderChange} from '@angular/material/slider';
import {ShopService} from '../../services/shop.service';
import {SubCategory} from '../../interfaces/sub-category';
import {Cart} from '../../interfaces/cart';
import {CartService} from '../../services/cart.service';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  // SUBSCRIPTION
  querySubscribe: Subscription = null;
  paramSubscribe: Subscription = null;

  // PRODUCTS
  public products: Product[] = [];

  // FILTER DATA SIDENAV
  dataFields: any[] = [];

  // SLUG
  public catSlug: string = null;
  public subCatSlug: string = null;
  public brandSlug: string = null;

  // QUERY
  private paramQuery: object;
  public filterQueryArray: any[] = [];
  rangeSet = false;
  priceRange: { min: number; max: number } = {min: 0, max: 0};
  priceRangeQuery: { min: number; max: number } = {min: null, max: null};
  public sorting = ['Lowest first', 'Highest first'];
  public sort = 'Lowest first';
  public sortValue = 1;

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 21;

  // SIDENAV
  @ViewChild('sidenav', {static: true}) sidenav: any;
  public sidenavOpen = true;

  // NO PRODUCT
  noProduct: boolean = null;

  // VIEW TYPE
  public viewType = 'grid';

  // COUNT VIEW
  public counts = [21, 42, 63, 84];
  public count: any;

  // TOP TAG LIST
  public menuLabels: any[] = [];
  public subCategoriesTag: SubCategory[] = [];

  // CARTS
  carts: Cart[] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private reloadService: ReloadService,
    private userDataService: UserDataService,
    private uiService: UiService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private shopService: ShopService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) public platformId: any
  ) {
  }

  ngOnInit(): void {
    let currentUrl = this.router.url;
    console.log("product", currentUrl)

    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth < 960) {
        this.sidenavOpen = false;
      }
    }

    this.count = this.counts[0];
    /**
     * GET DATA FROM PARAM
     */

    this.querySubscribe = this.activatedRoute.queryParams.subscribe(param => {

      if (param.page) {
        this.currentPage = param.page;
      } else {
        this.currentPage = 1;
      }
      this.paramSubscribe = this.activatedRoute.paramMap.subscribe(params => {

        this.rangeSet = false;
        this.filterQueryArray = [];

        this.catSlug = params.get('catSlug');
        this.subCatSlug = params.get('subCatSlug');
        this.brandSlug = params.get('brandSlug');

        // PARAM QUERY
        if (this.catSlug && this.subCatSlug && this.brandSlug) {
          this.paramQuery = {categorySlug: this.catSlug, subCatSlug: this.subCatSlug, brandSlug: this.brandSlug};
        } else if (this.catSlug && this.subCatSlug && !this.brandSlug) {
          this.paramQuery = {categorySlug: this.catSlug, subCatSlug: this.subCatSlug};
          this.getRelatedBrandsFromMenu();
        } else if (this.catSlug && !this.subCatSlug && !this.brandSlug) {
          this.paramQuery = {categorySlug: this.catSlug};
          this.getSubCatsByParentSlug();
        } else {
          // TODO NOTHING
        }

        // FILTER DATA FIELD
        if (this.subCatSlug) {
          this.getFilterSubCategory(this.subCatSlug);
        } else {
          this.getFilterCategory(this.catSlug);
        }

        // GET PRODUCTS
        this.getProductByFilters();
        this.getMaxMinPrice();


      });

    });


    // GET VIEW TYPE
    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth > 960) {
        this.getViewType();
      }
    }

    this.getCartsItems();


  }

  /**
   * CART
   */
  // GET CARTS DATA
  private getCartsItems() {
    if (this.userService.getUserStatus()) {
      this.getCartItemList();
    } else {
      this.getCarsItemFromLocal();
    }

  }

  private getCartItemList() {
    this.cartService.getCartItemList()
      .subscribe(res => {
        this.carts = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getCarsItemFromLocal() {
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


  /**
   *  HTTP REQUEST HANDLE
   */

  private getProductByFilters() {
    // SPINNER
    this.spinner.show();
    this.productService.getProductByFilters(
      this.paramQuery,
      this.sortValue,
      this.rangeSet ? this.priceRangeQuery : null,
      {pageSize: this.productsPerPage, currentPage: this.currentPage},
      this.filterQueryArray
    )
      .subscribe(res => {
        this.totalProducts = res.count;
        this.products = res.data;
        this.noProduct = this.products.length <= 0;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
      });
  }

  public getMaxMinPrice() {
    this.productService.getMaxMinPrice(this.paramQuery)
      .subscribe(res => {
        this.priceRange.min = res.data && res.data.length > 0 ? res.data[0].min : 0;
        this.priceRange.max = res.data && res.data.length > 0 ? res.data[0].max : 0;
        this.priceRangeQuery.min = 0;
        this.priceRangeQuery.max = res.data && res.data.length > 0 ? res.data[0].max : 0;
      }, error => {
        console.log(error);
      });
  }


  /**
   * FILTERING
   */
  private getFilterCategory(slug: string) {
    this.productService.getCategoryFilter(slug)
      .subscribe(res => {
        if (res.data !== null) {
          this.dataFields = res.data.filters;
        }
      });
  }

  private getFilterSubCategory(slug: string) {
    this.productService.getSubCategoryFilter(slug)
      .subscribe(res => {
        if (res.data !== null) {
          this.dataFields = res.data.filters;
        }
      });
  }

  private getRelatedBrandsFromMenu() {
    this.shopService.getAllMenu()
      .subscribe(res => {
        const menus = res.data;
        const filteredMenu = menus.filter(m => {
          return m.slug === this.catSlug;
        });
        const f = filteredMenu.map(m => {
          const g = m.subCategories.find(fo => fo.slug === this.subCatSlug);
          if (g !== undefined && g !== null) {
            return g.brands;
          } else {
            return [];
          }
        });
        this.menuLabels = f[0];
      }, error => {
        console.log(error);
      });
  }

  private getSubCatsByParentSlug() {
    this.productService.getSubCatsByParentSlug(this.catSlug)
      .subscribe(res => {
        this.subCategoriesTag = res.data;
      }, error => {
        console.log(error);
      });
  }


  /**
   * NGX PAGINATION CHANGED
   */

  public onChangePage(event: number) {
    this.router.navigate([], {queryParams: {page: event}});
  }


  /**
   *  FILTERING
   */

  /**
   * PRICE RANGE
   */

  onInputChangeMin(event: MatSliderChange) {
    this.router.navigate([], {queryParams: {page: 1}});
    setTimeout(() => {
      this.rangeSet = true;
      this.priceRangeQuery.min = event.value;
      this.getProductByFilters();
    }, 500);

  }

  onInputChangeMax(event: MatSliderChange) {
    this.router.navigate([], {queryParams: {page: 1}});
    setTimeout(() => {
      this.rangeSet = true;
      this.priceRangeQuery.max = event.value;
      this.getProductByFilters();
    }, 500);
  }

  public onFilterDataChange(event: MatCheckboxChange, it: any, key: string) {
    this.router.navigate([], {queryParams: {page: 1}});
    const newField = `filters.${key}`;
    const value: string = it.key;
    const newObj = {[newField]: value};
    this.currentPage = 1;

    if (event.checked) {
      this.filterQueryArray.push(newObj);
      this.getProductByFilters();
    } else {
      for (let i = this.filterQueryArray.length - 1; i >= 0; --i) {
        if (this.filterQueryArray[i][newField] === value) {
          this.filterQueryArray.splice(i, 1);
        }
      }
      this.getProductByFilters();
    }
  }

  /**
   * SORT
   */

  public changeSorting(sort) {
    if (sort === 'Lowest first') {
      this.sort = 'Lowest first';
      this.sortValue = 1;
    } else if (sort === 'Highest first') {
      this.sort = 'Highest first';
      this.sortValue = -1;
    }
    this.getProductByFilters();
  }

  /**
   * CHANGE PRODUCT COUNT VIEW
   */
  public changeCount(count) {
    this.router.navigate([], {queryParams: {page: 1}});
    this.count = count;
    this.productsPerPage = count;
    this.getProductByFilters();
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }


  /**
   * GET LAYOUT VIEW TYPE
   */

  private getViewType() {
    this.viewType = this.localStorageService.getDataFromLocalStorage('viewType') === null ? 'grid' : this.localStorageService.getDataFromLocalStorage('viewType');
  }

  public changeViewType(viewType) {
    this.viewType = viewType;
    this.localStorageService.addDataToLocalStorage('viewType', viewType);
    // this.viewCol = viewCol;
  }


  /**
   * NAVIGATION ROUTE
   */
  onClickCard(slug: string) {
    this.router.navigate(['/product', slug]);
  }

  /**
   * COMPARE LIST
   */
  addToCompareList(event: MouseEvent, product: Product) {
    event.stopPropagation();
    this.productService.addToCompare(product);
    this.reloadService.needRefreshCompareList$();

  }

  /**
   * CART FUNCTION
   */

  addItemToCartDB(data: UserCartDB) {
    this.userDataService.addItemToUserCart(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshCart$();
      }, error => {
        console.log(error);
      });
  }

  addToCartItem(product: Product) {
    const cartItem: UserCartDB = {
      product: product?._id,
      selectedQty: 1,
      orderType: 'regular'
    };


    if (this.userService.getUserStatus()) {
      this.userDataService.getCartStatusOnBook(product._id)
        .subscribe(res => {
          const data = res.data;
          if (data === null) {
            this.addItemToCartDB(cartItem);
          } else {
            this.uiService.warn('Already added to cart item');
          }
        }, error => {
          console.log(error);
        });
    } else {
      const items = this.userDataService.getCartProductFromLocalStorage();
      let cartsItems;
      if (items === null) {
        cartsItems = [];
      } else {
        cartsItems = items;
        const cart = cartsItems.find(item => item.product === product._id);
        if (cart !== undefined && cart !== null) {
          this.uiService.warn('Already added to cart item');
        } else {
          this.uiService.success('Success. added to cart item');
          this.userDataService.addCartProductToLocalStorage(cartItem);
          this.reloadService.needRefreshLocal$();
        }
      }
    }
  }


  addToCart(event: MouseEvent, product: Product) {
    event.stopPropagation();
    this.addToCartItem(product);
  }


  ngOnDestroy(): void {
    if (this.paramSubscribe) {
      this.paramSubscribe.unsubscribe();
    }
    if (this.querySubscribe) {
      this.querySubscribe.unsubscribe();
    }
  }


}

import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
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
import {ShopService} from '../../services/shop.service';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-products-search',
  templateUrl: './products-search.component.html',
  styleUrls: ['./products-search.component.scss']
})
export class ProductsSearchComponent implements OnInit, OnDestroy {

  // SUBSCRIPTION
  querySubscribe: Subscription = null;
  paramSubscribe: Subscription = null;

  // PAGINATION
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 21;

  // SORTING
  public sorting = ['No Sorting', 'Lowest first', 'Highest first'];
  public sort = 'No Sorting';
  public sortValue = '0';

  // NO PRODUCT
  noProduct: boolean = null;

  // VIEW TYPE
  public viewType = 'grid';

  // COUNT VIEW
  public counts = [21, 42, 63, 84];
  public count: any;

  // SEARCH
  public searchQuery: string = null;

  // PRODUCTS
  public products: Product[] = [];

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
    @Inject(PLATFORM_ID) public platformId: any
  ) {
  }


  ngOnInit(): void {

    // this.querySubscribe = this.activatedRoute.queryParams.subscribe(param => {

    //     this.searchQuery = param.searchQuery;
    //     this.currentPage = param.page;

    //     console.log(this.searchQuery);
    //     console.log(this.currentPage);

    //     // GET PRODUCTS
    //     this.getSearchProduct();

    // });

    this.count = this.counts[0];

    this.querySubscribe = this.activatedRoute.queryParams.subscribe(param => {

      if (param.page) {
        this.currentPage = param.page;
      } else {
        this.currentPage = 1;
      }

      this.paramSubscribe = this.activatedRoute.paramMap.subscribe(params => {

        this.searchQuery = params.get('search');

        // GET PRODUCTS
        this.getSearchProduct();

      });

    });


  }

  /**
   *  HTTP REQUEST HANDLE
   */

  private getSearchProduct() {
    this.productService.getSearchProduct(this.searchQuery, {
      pageSize: this.productsPerPage,
      currentPage: this.currentPage
    }, this.sortValue)
      .subscribe(res => {
        this.products = res.data;
        this.totalProducts = res.count;
        this.noProduct = this.products.length <= 0;
        console.log(this.products);
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
   * SORT
   */

  public changeSorting(sort) {
    console.log(sort);

    if (sort === 'Lowest first') {
      this.sort = 'Lowest first';
      this.sortValue = '1';
    } else if (sort === 'Highest first') {
      this.sort = 'Highest first';
      this.sortValue = '-1';
    } else if (sort === 'No Sorting') {
      this.sortValue = '0';
    }
    console.log(this.sortValue);

    this.getSearchProduct();
  }

  /**
   * CHANGE PRODUCT COUNT VIEW
   */

  public changeCount(count) {
    this.router.navigate([], {queryParams: {page: 1}});
    this.count = count;
    this.productsPerPage = count;
    this.getSearchProduct();
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

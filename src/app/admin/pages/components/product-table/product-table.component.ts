import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ProductService} from '../../../../services/product.service';
import {Product} from '../../../../interfaces/product';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {MatOption} from '@angular/material/core';
import {MatSelect, MatSelectChange} from '@angular/material/select';
import {NgForm} from '@angular/forms';
import {EMPTY, Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Pagination} from '../../../../interfaces/pagination';
import {debounceTime, distinctUntilChanged, pluck, switchMap} from 'rxjs/operators';
import {SearchCollection} from "../../../../interfaces/search-collection";



@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent implements OnInit, AfterViewInit, OnDestroy {

  // Subscriptions
  private subProduct: Subscription;
  private subCat: Subscription;
  private subSubCat: Subscription;
  private subAcRoute: Subscription;
  private subForm: Subscription;

  // Store Data
  products: Product[] = [];
  private holdPrevData: any[] = [];
  categories: any[] = [];
  subCategories: any[] = [];

  // Selected Products
  selectedIds: string[] = [];
  selectedProducts: Product[] = [];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 6;
  totalProductsStore = 0;

  // SEARCH AREA
  searchProducts: Product[] = [];
  isLoading = false;
  isSelect = false;
  searchQuery = null;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;

  // Query
  query: any = null;
  filtersSelections: any[] = [
    {viewValue: 'None', value: null},
    // {viewValue: 'No Image', value: {image: null}},
    // {viewValue: 'No PDF', value: {pdfUrl: null}},
    // {viewValue: 'No Specification', value: {bookExtraData: null}},
    // {viewValue: 'No Price Data', value: {orderTypSlug: null}},
    {viewValue: 'Regular Order', value: {orderTypSlug: 'regular-order'}},
    {viewValue: 'Pre Order', value: {orderTypSlug: 'pre-order'}},
    {viewValue: 'Package', value: {package: true}},
    {viewValue: 'Bookish Gadgets', value: {categorySlug: 'bookish-gadgets'}},
    // {viewValue: 'Quantity Low to High', value: null, sort: {availableQuantity: 1}},
    // {viewValue: 'Quantity High to Low', value: null, sort: {availableQuantity: -1}},
    // {viewValue: 'Price Low to High', value: null, sort: {price: 1}},
    // {viewValue: 'Price High to Low', value: null, sort: {price: -1}}
  ];

  // Select View Child
  @ViewChild('matCatSelect') matCatSelect: MatSelect;
  @ViewChild('matSubCatSelect') matSubCatSelect: MatSelect;

  constructor(
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<ProductTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    // GET PAGE FROM QUERY PARAM
    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }

      // GET DATA
      if (!this.searchQuery) {
        this.getAllProducts();
      } else {
        this.getSearchData();
      }
    });

    // IF HAS DATA FROM PARENT
    if (this.data) {
      this.selectedIds = this.data;
    }

  }

  ngAfterViewInit(): void {
    const formValue = this.searchForm.valueChanges;

    this.subForm = formValue.pipe(
      // map(t => t.searchTerm)
      // filter(() => this.searchForm.valid),
      pluck('searchTerm'),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(data => {
        this.searchQuery = data?.trim();
        if (this.searchQuery === '' || this.searchQuery === null) {
          this.searchProducts = [];
          this.products = this.holdPrevData;
          this.totalProducts = this.totalProductsStore;
          this.searchProducts = [];
          this.searchQuery = null;
          return EMPTY;
        }
        this.isLoading = true;
        const searchCollection: SearchCollection = {
          collectionName: 'book',
          query: data
        };
        const pagination: Pagination = {
          pageSize: this.productsPerPage.toString(),
          currentPage: this.currentPage.toString()
        };
        return this.productService.getFromCollectionBySearch(searchCollection, pagination);
      })
    )
      .subscribe(res => {
        this.isLoading = false;
        this.searchProducts = res.data;
        this.products = this.searchProducts;
        this.totalProducts = res.count;
        this.currentPage = 1;
        this.router.navigate([], {queryParams: {page: this.currentPage}});
      }, error => {
        this.isLoading = false;
      });
  }

  /**
   * HTTP REQ
   */

  private getAllProducts() {
    this.spinner.show();

    const pagination = {
      pageSize: this.productsPerPage,
      currentPage: this.currentPage
    };

    this.subProduct = this.productService.getProductsByQuery(this.query, pagination, {updatedAt: -1})
      .subscribe(res => {
        this.products = res.data;
        if (this.products && this.products.length > 0) {
          this.products.forEach((m, i) => {
            const index = this.selectedIds.findIndex(f => f === m._id);
            this.products[i].select = index !== -1;
          });
          this.holdPrevData = res.data;
          this.totalProducts = res.count;
          this.totalProductsStore = res.count;
        }
        this.spinner.hide();

      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private getSearchData() {
    this.spinner.show();
    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };
    const searchCollection: SearchCollection = {
      collectionName: 'book',
      query: this.searchQuery,
    };

    this.productService.getFromCollectionBySearch(searchCollection, pagination)
      .subscribe(res => {
        this.isLoading = false;
        this.searchProducts = res.data;
        this.products = this.searchProducts;
        this.totalProducts = res.count;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }


  /**
   * ON SELECTION CHANGE
   */
  onFilterSelectChange(event: MatSelectChange) {
    this.query = event.value;

    console.log(this.query);

    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}});
    } else {
      this.getAllProducts();
    }
  }

  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }


  /**
   * SELECTION CHANGE
   * FILTER
   */

  /**
   * ON REMOVE
   */
  onClearFilter() {
    this.matCatSelect.options.forEach((data: MatOption) => data.deselect());
    // this.matSubCatSelect.options.forEach((data: MatOption) => data.deselect());
    this.query = null;
    this.router.navigate([], {queryParams: {page: null}, queryParamsHandling: 'merge'});
  }

  onCheckChange(event: any, index: number, id: string) {
    if (event) {
      this.selectedIds.push(id);
    } else {
      const i = this.selectedIds.findIndex(f => f === id);
      this.selectedIds.splice(i, 1);
    }
  }

  /**
   * ON CLOSE DIALOG
   */
  onCloseDialog(passData?: boolean) {
    this.dialogRef.close({selectedIds: passData ? this.selectedIds : null});
    this.router.navigate([], {queryParams: {page: null}, queryParamsHandling: 'merge'});
  }

  /**
   * ON DESTROY
   */
  ngOnDestroy() {

    if (this.subAcRoute) {
      this.subAcRoute.unsubscribe();
    }
    if (this.subProduct) {
      this.subProduct.unsubscribe();
    }
    if (this.subCat) {
      this.subCat.unsubscribe();
    }
    if (this.subSubCat) {
      this.subSubCat.unsubscribe();
    }
    if (this.subForm) {
      this.subForm.unsubscribe();
    }
  }




}

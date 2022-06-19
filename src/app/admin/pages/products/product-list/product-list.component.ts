import {Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {AppService} from 'src/app/app.service';
import {ConfirmDialogComponent} from 'src/app/shared/components/ui/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {EMPTY, forkJoin} from 'rxjs';

import {NgxSpinnerService} from 'ngx-spinner';
import {PageEvent} from '@angular/material/paginator';
import {debounceTime, distinctUntilChanged, pluck, switchMap} from 'rxjs/operators';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {isPlatformBrowser} from '@angular/common';
import {Product} from "../../../../interfaces/product";
import {ProductService} from "../../../../services/product.service";
import {FileUploadService} from "../../../../services/file-upload.service";
import {ReloadService} from "../../../../services/reload.service";
import {UiService} from "../../../../services/ui.service";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  public products: Product[] = [];
  public productBaseList: Product[] = [];
  public viewCol = 25;
  public page: any;
  public count = 12;

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  totalProductsBase = 0;
  currentPageSearch = 1;
  totalProductsSearch = 0;
  productsPerPage = 24;
  pageSizeOption = [8, 16, 24, 32];

  // Search
  searchProducts: Product[] = [];
  overlay = false;
  isOpen = false;
  isFocused = false;
  isLoading = false;
  isSelect = false;
  query = null;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;

  constructor(
    public appService: AppService,
    public dialog: MatDialog,
    private productService: ProductService,
    private fileUploadService: FileUploadService,
    private reloadService: ReloadService,
    private uiService: UiService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) public platformId: any
  ) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth < 1280) {
        this.viewCol = 33.3;
      }
    }

    this.activatedRoute.queryParams.subscribe(param => {
      if (param.page) {
        this.currentPage = param.page;
      }
      // this.getProductsList();
      // this.getProductsByLimit(this.productsPerPage.toString(), this.currentPage.toString());
    });

    this.reloadService.refreshBook$.subscribe(() => {
      this.getProductsByLimit(this.productsPerPage.toString(), this.currentPage.toString());
    });
    this.getProductsByLimit(this.productsPerPage.toString(), this.currentPage.toString());


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
          this.products = this.productBaseList;
          this.totalProducts = this.totalProductsBase;
          // this.searchProducts = [];
          this.query = null;
          this.currentPageSearch = 1;
          return EMPTY;
        }
        console.log('Iam Here')
        this.isLoading = true;
        return this.productService.getSearchProduct(data, {pageSize: this.productsPerPage.toString(), currentPage: this.currentPageSearch.toString()}, "0");
      })
    )
      .subscribe(res => {
        this.isLoading = false;
        // this.searchProducts = res.data;
        this.products = res.data;
        this.totalProducts = res.count;
      }, error => {
        this.isLoading = false;
      });
  }


  @HostListener('window:resize')
  public onWindowResize(): void {
    if (isPlatformBrowser(this.platformId)) {
      (window.innerWidth < 1280) ? this.viewCol = 33.3 : this.viewCol = 25;
    }
  }


  public remove(product: Product) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Action',
        message: 'Are you sure you want delete this product?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (product.images === null) {
          this.deleteProduct(product._id);
        } else {
          this.parallelDeleteWithImage(product);
        }
      }
    });
  }


  /**
   * HTTP REQ HANDLE
   */

  // private getProductList() {
  //   this.productService.getAllProductList()
  //     .subscribe(res => {
  //       this.products = res.data;
  //     }, error => {
  //       console.log(error);
  //     });
  // }

  public getProductsByLimit(productPerPage: string, currentPage: string) {
    this.spinner.show();
    this.productService.getProductsByLimit(productPerPage, currentPage).subscribe(res => {
      this.totalProducts = res.count;
      this.totalProductsBase = res.count;
      this.products = res.data;
      this.productBaseList = res.data;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.log(error)
    });
  }

  private deleteProduct(id: string) {
    this.productService.deleteProduct(id)
      .subscribe(res => {
        this.reloadService.needRefreshBook$();
        this.uiService.success(res.message);
      }, error => {
        this.uiService.wrong(error.message);
        console.log(error);
      });
  }

  private parallelDeleteWithImage(product: Product) {
    const productPromise = this.productService.deleteProduct(product._id);
    const imagePromise = this.fileUploadService.removeFileMulti(product.images);

    forkJoin([productPromise, imagePromise]).subscribe(results => {
      console.log(results[0].message)
      console.log(results[1].message)
      this.reloadService.needRefreshBook$();
    });
  }


  /**
   * MAT PAGINATION CHANGE EVENT
   */

  // onChangePage(event: PageEvent) {
  //   this.currentPage = event.pageIndex + 1;
  //   this.productsPerPage = event.pageSize;
  //   this.getProductsByLimit(this.productsPerPage.toString(), this.currentPage.toString());
  //   window.scrollTo(0, 0);
  // }



  // public onPageChanged(event) {
  //   if (this.query === '' || this.query === null) {
  //     this.currentPage = event;
  //     this.getProductsByLimit(this.productsPerPage.toString(), this.currentPage.toString());
  //     // console.log(this.page)
  //     window.scrollTo(0, 0);
  //   } else {
  //     this.currentPageSearch = event;
  //     this.getProductInQuery();
  //     window.scrollTo(0, 0);
  //   }
  // }
  /**
   * NGX PAGINATION CHANGED
   */

  public onPageChanged(event: number) {
    this.router.navigate([], {queryParams: {page: event}});
    setTimeout(() => {
      this.getPageFromQueryParam();
    })
  }

  private getPageFromQueryParam() {
    this.activatedRoute.queryParams.subscribe(param => {
      if (this.query === '' || this.query === null) {
        this.currentPage = param.page ? param.page : 1;
        console.log(this.currentPage)
        this.getProductsByLimit(this.productsPerPage.toString(), this.currentPage.toString());
        // console.log(this.page)
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0, 0);
        }
      } else {
        this.currentPageSearch = param.page;
        this.getProductInQuery();
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0, 0);
        }
      }
    });
  }


  private getProductInQuery() {
    this.isLoading = true;
    this.productService.getSearchProduct(this.query, {pageSize: this.productsPerPage.toString(), currentPage: this.currentPageSearch.toString()})
      .subscribe(res => {
        this.products = res.data;
        this.totalProducts = res.count;
        this.isLoading = false;
      }, error => {
        console.log(error)
      })
  }


}

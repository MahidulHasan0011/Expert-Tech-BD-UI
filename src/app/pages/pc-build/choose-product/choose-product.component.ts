import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PcBuildService } from '../../../services/pc-build.service';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../interfaces/product';
import { NgxSpinnerService } from 'ngx-spinner';
import { PageEvent } from '@angular/material/paginator';
import { NgForm } from '@angular/forms';
import { EMPTY } from 'rxjs';
import {
  pluck,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { ProductImagePipe } from 'src/app/shared/pipes/product-image.pipe';

@Component({
  selector: 'app-choose-product',
  templateUrl: './choose-product.component.html',
  styleUrls: ['./choose-product.component.scss'],
  providers:[
    ProductImagePipe
  ]
})
export class ChooseProductComponent implements OnInit, AfterViewInit {
  componentId: string = null;
  componentTag: string = null;
  componentSlug: string = null;

  productList: Product[] = [];
  noProduct: boolean = null;

  // Filter QUERY
  private query: object;

  // Filters
  public baseProducts: Product[] = [];
  dataFields: any[] = [];
  priceRange: { min: number; max: number } = { min: 0, max: 0 };
  filterQueryArray: any[] = [];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 6;
  pageSizeOption = [6, 12, 24, 36];

  // SEARCH AREA
  searchProducts: Product[] = [];
  overlay = false;
  isOpen = false;
  isFocused = false;
  isLoading = false;
  isSelect = false;
  filterQuery = null;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private pcBuildService: PcBuildService,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    private productImagePipe :ProductImagePipe,
    @Inject(PLATFORM_ID) public platformId: any
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      console.log(param);
      this.componentId = param.get('id');
      this.componentTag = param.get('componentTag');
      this.componentSlug = param.get('componentCatSlug');
      if (this.componentTag === this.componentSlug) {
        this.query = {
          $or: [
            { categorySlug: this.componentTag },
            { subCatSlug: this.componentSlug },
          ],
        };
      } else if (this.componentSlug === 'ram') {
        (this.query = { categorySlug: this.componentTag }),
          { subCatSlug: 'ram-(desktop)' };
      } else {
        this.query = {
          categorySlug: this.componentTag,
          subCatSlug: this.componentSlug,
        };
      }
      //  this.query = {categorySlug: this.componentTag, subCatSlug: this.componentSlug};
      this.productFilterByQuery(this.query, {
        pageSize: this.productsPerPage,
        currentPage: this.currentPage,
      });
      this.getFilterCategory(this.componentTag);
    });
  }

  ngAfterViewInit(): void {
    const formValue = this.searchForm.valueChanges;

    formValue
      .pipe(
        // map(t => t.searchTerm)
        // filter(() => this.searchForm.valid),
        pluck('searchTerm'),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((data) => {
          this.filterQuery = data;
          if (this.filterQuery === '' || this.filterQuery === null) {
            this.overlay = false;
            this.searchProducts = [];
            this.filterQuery = null;
            return EMPTY;
          }
          this.isLoading = true;
          return this.productService.getSearchProduct(
            data,
            null,
            '0',
            this.query
          );
        })
      )
      .subscribe(
        (res) => {
          this.totalProducts = res.count;
          this.productList = res.data;
          this.noProduct = this.productList.length <= 0;
          this.isLoading = false;
          // this.searchProducts = res.data;
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }

  // private getProductByCatSlug() {
  //   this.filterProducts = this.productList.filter(p => p.catSlug === this.componentSlug);
  // }

  /**
   *
   */

  onAddToPcBuild(p: Product) {
    
    console.log('onAddToPcBuild',p);
    const data = {
      name: p.name,
      price: p.salePrice,
      // image: p?.images[0]?.small,
      // image: p?.images[0]?.small ? p?.images[0]?.small : p?.productImages[0],
      image: this.productImagePipe.transform(p,'single')
    };
    this.pcBuildService.addProductToBuildTool(this.componentId, data);
    this.router.navigate(['/pc-builder']);
  }

  /**
   * HTTP REQ HANDLE
   */

  public productFilterByQuery(query: object, paginate: object) {
    this.spinner.show();
    console.log('query:', query);
    this.productService.productFilterByQuery(query, paginate).subscribe(
      (res) => {
        console.log('res:', res);
        this.totalProducts = res.count;
        this.productList = res.data;
        // this.noProduct = this.productList.length <= 0;
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  /**
   * FILTERING
   * SELECTION CHANGE
   */
  private getFilterCategory(slug: string) {
    this.productService.getCategoryFilter(slug).subscribe((res) => {
      this.dataFields = res.data.filters;
      this.priceRange = res.data?.priceRange;
    });
  }

  /**
   * MAT PAGINATION CHANGE EVENT
   */

  onChangePage(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.productsPerPage = event.pageSize;
    // this.getProductsByLimit(this.productsPerPage.toString(), this.currentPage.toString());
    this.productFilterByQuery(this.query, {
      pageSize: this.productsPerPage,
      currentPage: this.currentPage,
    });
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }
}

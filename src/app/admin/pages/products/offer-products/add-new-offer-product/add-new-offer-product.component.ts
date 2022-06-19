import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {debounceTime, distinctUntilChanged, pluck, switchMap} from 'rxjs/operators';
import {EMPTY} from 'rxjs';
import {NgForm} from '@angular/forms';

import {MatDialog} from '@angular/material/dialog';
import {AddOfferDialogComponent} from '../add-offer-dialog/add-offer-dialog.component';
import {Product} from "../../../../../interfaces/product";
import {ProductService} from "../../../../../services/product.service";
import {UserDataService} from "../../../../../services/user-data.service";
import {UserService} from "../../../../../services/user.service";
import {ReloadService} from "../../../../../services/reload.service";
import {ShopService} from "../../../../../services/shop.service";

@Component({
  selector: 'app-add-new-offer-product',
  templateUrl: './add-new-offer-product.component.html',
  styleUrls: ['./add-new-offer-product.component.scss']
})
export class AddNewOfferProductComponent implements OnInit, AfterViewInit {

  public viewCol = 25;
  public page: any;
  public count = 12;

  // SEARCH AREA
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
    private productService: ProductService,
    private dialog: MatDialog,
    private router: Router,
    private userDataService: UserDataService,
    private userService: UserService,
    private reloadService: ReloadService,
    private shopService: ShopService,
  ) {
  }

  ngOnInit(): void {
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
        return this.productService.getSearchProduct(data);
      })
    )
      .subscribe(res => {
        this.isLoading = false;
        this.searchProducts = res.data;
      }, error => {
        this.isLoading = false;
      });
  }

  /**
   * OFFER DIALOG
   */
  public openCategoryDialog(productId: string) {
    this.dialog.open(AddOfferDialogComponent, {
      data: {
        productId: productId
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      disableClose: true
    });
  }


  // onSelectItem(data: Product): void {
  //
  //   this.router.navigate(['/products', data.slug]);
  // }

}

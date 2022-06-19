import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {environment} from "../../../../../environments/environment";
import {Category} from "../../../../interfaces/category";
import {PromotionalOffer} from "../../../../interfaces/promotional-offer";
import {Product} from "../../../../interfaces/product";
import {PromotionalOfferProduct} from "../../../../interfaces/promotional-offer-product";
import {ActivatedRoute, Router} from "@angular/router";
import {UiService} from "../../../../services/ui.service";
import {StorageService} from "../../../../services/storage.service";
import {MatDialog} from "@angular/material/dialog";
import {ProductService} from "../../../../services/product.service";
import {NgxSpinnerService} from "ngx-spinner";
import {PromotionalOfferService} from "../../../../services/promotional-offer.service";
import {PromotionalOfferProductService} from "../../../../services/promotional-offer-product.service";
import {ProductTableComponent} from "../../components/product-table/product-table.component";
import {MatSelectChange} from "@angular/material/select";
import {PromoProductEditComponent} from "../promo-product-edit/promo-product-edit.component";

@Component({
  selector: 'app-add-promotional-offer-product',
  templateUrl: './add-promotional-offer-product.component.html',
  styleUrls: ['./add-promotional-offer-product.component.scss']
})
export class AddPromotionalOfferProductComponent implements OnInit {

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  // Subscriptions
  private subProduct: Subscription;

  // Admin Base Url
  readonly adminBaseUrl = environment.adminBaseUrl;

  dataForm: FormGroup;
  private sub: Subscription;
  categories: Category[] = [];
  promotionalOffers: PromotionalOffer[] = [];

  // Store Data from param
  id?: string;
  products: Product[] = [];
  promotionalOfferProduct: PromotionalOfferProduct = null;

  // From Dialog
  selectedProductIds: string[] = [];

  // Destroy Session
  needSessionDestroy = true;
  promotionalOfferSlug: string = null;


  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private storageService: StorageService,
    public router: Router,
    private dialog: MatDialog,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    private promotionalOfferService: PromotionalOfferService,
    private promotionalOfferProductService: PromotionalOfferProductService
  ) { }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      category: [null, Validators.required],
      promotionalOffer: [null, Validators.required],
      promotionalOfferSlug: [null],
      products: [null, Validators.required]
    });

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getSingleOfferProductById();
      }
    });

    this.getAllCategory();
    this.getAllPromotionalOffer();
  }

  /**
   * SET FORM DATA
   */
  private setFormData() {
    this.dataForm.patchValue(this.promotionalOfferProduct);

    if (this.storageService.getStoredInput('FEATURED_CATEGORY_INPUT')) {
      this.dataForm.patchValue(this.storageService.getStoredInput('FEATURED_CATEGORY_INPUT'));
    }
  }

  /**
   * OPEN COMPONENT DIALOG
   */

  public openComponentDialog(data?: any) {
    const dialogRef = this.dialog.open(ProductTableComponent, {
      data: this.promotionalOfferProduct ? this.products.map(m => m._id) : null,
      panelClass: ['theme-dialog', 'full-screen-modal'],
      width: '100%',
      height: '90vh',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.selectedIds) {
          this.selectedProductIds = dialogResult.selectedIds;
          this.dataForm.patchValue({products: dialogResult.selectedIds});
          this.getSpecificProductsById(this.selectedProductIds);
        }
      }
    });
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }

    if (this.id) {
      const finalData = {...this.dataForm.value, ...{_id: this.id, promotionalOfferSlug: this.promotionalOfferSlug}};
      this.editOfferProduct(finalData);
    } else {
      this.addNewOfferProduct({...this.dataForm.value, ...{promotionalOfferSlug: this.promotionalOfferSlug}});
    }
  }

  /**
   * ON HOLD INPUT DATA
   */

  onHoldInputData() {
    this.needSessionDestroy = false;
    this.storageService.storeInputData(this.dataForm?.value, 'FEATURED_CATEGORY_INPUT');
  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */
  private getAllCategory() {
    this.productService.getAllCategoryList()
      .subscribe(res => {
        this.categories = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getAllPromotionalOffer() {
    this.promotionalOfferService.getAllPromotionalOffer()
      .subscribe(res => {
        this.promotionalOffers = res.data;
      }, error => {
        console.log(error);
      });
  }

  private addNewOfferProduct(data: PromotionalOfferProduct) {
    this.promotionalOfferProductService.addNewPromotionalOfferProduct(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.storageService.removeSessionData('FEATURED_CATEGORY_INPUT');
        this.selectedProductIds = [];
        this.products = [];
      }, err => {
        console.log(err);
      });
  }

  private getSingleOfferProductById() {
    const selectProductField = '-attributes -filterData -tags -ratingReview -discussion -warrantyServices -description';
    this.promotionalOfferProductService.getSinglePromotionalOfferProductById(this.id, selectProductField)
      .subscribe(res => {
        this.promotionalOfferProduct = res.data;
        this.products = this.promotionalOfferProduct.products as Product[];
        this.setFormData();
      }, error => {
        console.log(error);
      });
  }

  private editOfferProduct(data: PromotionalOfferProduct) {
    this.promotionalOfferProductService.editPromotionalOfferProduct(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('FEATURED_CATEGORY_INPUT');
      }, err => {
        console.log(err);
      });
  }

  private getSpecificProductsById(ids: string[]) {
    this.spinner.show();
    const selectProductField = '-attributes -filterData -tags -ratingReview -discussion -warrantyServices -description';
    this.subProduct = this.productService.getSpecificProductsById(ids, selectProductField)
      .subscribe(res => {
        this.products = res.data;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  onCatSelect(event: MatSelectChange) {
    if (event.value) {
      const slug = this.categories.find(f => f._id === event.value).categoryName;
      this.dataForm.patchValue(
        {routerLink: slug}
      );
    }
  }

  onProOfferSelect(event: MatSelectChange) {
    if (event.value) {
      const slug = this.promotionalOffers.find(f => f._id === event.value).slug;
      this.dataForm.patchValue(
        {routerLink: slug}
      );
      this.promotionalOfferSlug = slug;
    }
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.subProduct) {
      this.subProduct.unsubscribe();
    }
    if (this.needSessionDestroy) {
      this.storageService.removeSessionData('FEATURED_CATEGORY_INPUT');
    }
  }

  editProductDialog(data: Product) {
    this.dialog.open(PromoProductEditComponent, {
      data,
      panelClass: ['theme-dialog'],
      autoFocus: false,
      disableClose: false
    });
  }
}

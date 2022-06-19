import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {UiService} from "../../../../services/ui.service";
import {UtilsService} from "../../../../services/utils.service";
import {ReloadService} from "../../../../services/reload.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Subscription} from "rxjs";
import {ProductService} from "../../../../services/product.service";
import {isPlatformBrowser} from "@angular/common";
import {DiscountTypeEnum} from "../../../../enum/discount-type.enum";

@Component({
  selector: 'app-promo-product-edit',
  templateUrl: './promo-product-edit.component.html',
  styleUrls: ['./promo-product-edit.component.scss']
})
export class PromoProductEditComponent implements OnInit {

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm?: FormGroup;
  private sub: Subscription;

  oldPrice = new FormControl(null);
  newPrice = new FormControl(null, {validators: [Validators.required]});
  discount = new FormControl(null);

  private finalProduct: any = null;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private utilsService: UtilsService,
    private reloadService: ReloadService,
    private productService: ProductService,
    public dialogRef: MatDialogRef<PromoProductEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      newPrice: this.newPrice,
      discount: this.discount,
    });
    console.log('Campaign Data')
    console.log(this.data)

    this.dataForm.patchValue({
      newPrice: this.data.salePrice,
      discount: this.data.discount,
    });

    // this.dataForm.patchValue(this.data);
  }


  onSubmit() {
    const data = {
        _id: this.data?._id,
        salePrice: this.dataForm.value.newPrice,
        discount: this.dataForm.value.discount,
        discountType: DiscountTypeEnum.CASH
    };
    this.editProductData(data);
  }

  private editProductData(data: any) {
    this.productService.editProductBasicData(data)
      .subscribe(res => {
        this.dialogRef.close();
        this.uiService.success(res.message);
      }, error => {
        console.log(error);
        this.uiService.warn('Something went wrong!');
      });
  }



}

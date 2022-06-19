import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Coupon } from 'src/app/interfaces/coupon';
import { ReloadService } from 'src/app/services/reload.service';
import { CouponType } from 'src/app/enum/coupon-type';
import { CouponDiscountType } from 'src/app/enum/coupon-discount-type';
import {CouponService} from "../../../../services/coupon.service";
import {UiService} from "../../../../services/ui.service";

@Component({
  selector: 'app-coupon-dialog',
  templateUrl: './coupon-dialog.component.html',
  styleUrls: ['./coupon-dialog.component.scss']
})
export class CouponDialogComponent implements OnInit {

  couponType: any[] = [
    {value: CouponType.AMOUNT, viewValue: 'Amount'},
    {value: CouponType.PERCENTAGE, viewValue: 'Percentage'},
  ];

  couponDiscountType: any[] = [
    {value: CouponDiscountType.ORDERDISCOUNT, viewValue: 'Order-Discount'},
    {value: CouponDiscountType.SHIPPINGDISCOUNT, viewValue: 'Shipping-Discount'},
    {value: CouponDiscountType.TOTALDISCOUNT, viewValue: 'Total-Discount'},
  ];

  public products = [];
  public form: FormGroup;

  constructor(
    private couponService: CouponService,
    private uiService: UiService,
    public reloadService: ReloadService,
    public dialogRef: MatDialogRef<CouponDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder
  ) {
  }


  ngOnInit(): void {
    this.form = this.fb.group({
      couponName: ['', Validators.required],
      couponAmount: ['', Validators.required],
      couponCode: ['', Validators.required],
      couponType: ['', Validators.required],
      couponDiscountType: ['', Validators.required],
      couponLimit: ['', Validators.required],
      couponStartDate: ['', Validators.required],
      couponEndDate: ['', Validators.required]
    });

    // if (this.data.coupon) {
    //   console.log(this.data.coupon);
    //   this.form.patchValue(this.data.coupon);
    //   this.products = this.data.coupon.restriction.products;
    // }
    if(this.data) {
      this.form.patchValue(this.data);
    }

  }

  // ASHFAQ

  public onSubmit() {
    if(this.data) {
      this.editCoupon(this.data._id, this.form.value);
    } else {
      this.addNewCoupon(this.form.value);
    }
    //console.log(this.form.value);
    // if (this.form.valid) {
    //   this.dialogRef.close(this.form.value);
    // }
  }


  private addNewCoupon(data: Coupon) {
    this.couponService.addNewCoupon(data).subscribe(res => {
      this.uiService.success(res.message);
      this.reloadService.needRefreshCoupon$();
      this.dialogRef.close();
    }, error => {
      console.log(error);
      this.uiService.warn("Something went wrong!");
    })
  }

  private editCoupon(couponId: String, data: Coupon) {
    this.couponService.editCoupon(couponId, data).subscribe(res => {
      this.uiService.success(res.message);
      this.reloadService.needRefreshCoupon$();
      this.dialogRef.close();
    }, error => {
      console.log(error);
      this.uiService.warn("Something went wrong!");
    })
  }

  // ASHFAQ

}

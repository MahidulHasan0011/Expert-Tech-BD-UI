import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import { AppService } from 'src/app/app.service';
import { MatDialog } from '@angular/material/dialog';
import { coupons } from './coupons';
import { CouponDialogComponent } from './coupon-dialog/coupon-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/ui/confirm-dialog/confirm-dialog.component';
import { Category } from 'src/app/app.models';
import { AppSettings, Settings } from 'src/app/app.settings';
import { UiService } from 'src/app/services/ui.service';
import { ReloadService } from 'src/app/services/reload.service';
import { Coupon } from 'src/app/interfaces/coupon';
import { CouponType } from 'src/app/enum/coupon-type';
import { CouponDiscountType } from 'src/app/enum/coupon-discount-type';
import {isPlatformBrowser} from '@angular/common';
import {CouponService} from "../../../services/coupon.service";



@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {

  couponType: any[] = [
    {value: CouponType.AMOUNT, viewValue: 'Amount'},
    {value: CouponType.PERCENTAGE, viewValue: 'Percentage'},
  ];

  couponDiscountType: any[] = [
    {value: CouponDiscountType.ORDERDISCOUNT, viewValue: 'Order-Discount'},
    {value: CouponDiscountType.SHIPPINGDISCOUNT, viewValue: 'Shipping-Discount'},
    {value: CouponDiscountType.TOTALDISCOUNT, viewValue: 'Total-Discount'},
  ];

  public coupons: Coupon[] = [];
  // public stores = [
  //   { id: 1, name: 'Store 1' },
  //   { id: 2, name: 'Store 2' }
  // ];
  // public discountTypes = [
  //   { id: 1, name: 'Percentage discount' },
  //   { id: 2, name: 'Fixed Cart Discount' },
  //   { id: 3, name: 'Fixed Product Discount' }
  // ];
  // public categories:Category[];
  public page: any;
  public count = 6;
  public settings:Settings;
  constructor (
    public appService:AppService,
    public dialog: MatDialog,
    public appSettings:AppSettings,
    public uiService: UiService,
    private couponService: CouponService,
    public reloadService: ReloadService,
    @Inject(PLATFORM_ID) public platformId: any
    ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    this.getAllCoupons();
    this.reloadService.refreshCoupon$.subscribe(()=>{
      this.getAllCoupons();
    });

    //this.coupons = coupons;
    // this.getCategories();
  }

  // public getCategories(){
  //   this.appService.getCategories().subscribe(data => {
  //     this.categories = data;
  //     this.categories.shift();
  //   });
  // }

  public onPageChanged(event){
    this.page = event;
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0,0);
    }
  }

  public openCouponDialog(coupon?:Coupon){
    const dialogRef = this.dialog.open(CouponDialogComponent, {
      data: coupon,
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: (this.settings.rtl) ? 'rtl' : 'ltr'
    });
    dialogRef.afterClosed().subscribe(coupon => {
      if(coupon){
        const index: number = this.coupons.findIndex(x => x._id == coupon.id);
        if(index !== -1){
          this.coupons[index] = coupon;
        }
        else{
          let last_coupon= this.coupons[this.coupons.length - 1];
          coupon.id = last_coupon._id + 1;
          this.coupons.push(coupon);
        }
      }
    });
  }

// ASHFAQ

  //HTTP REQ HANDLE

  public getAllCoupons() {
    this.couponService.getAllCoupons()
    .subscribe(res => {
        this.coupons = res.data;
      }, error => {
        console.log(error);
      });
  }

  public deleteCoupon(couponId: String){

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm Action",
        message: "Are you sure you want remove this coupon?"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult){
        this.couponService.deleteCoupon(couponId).subscribe(res => {
          this.uiService.success(res.message);
          this.reloadService.needRefreshCoupon$();
        });
      }
    });
  }

// ASHFAQ

}

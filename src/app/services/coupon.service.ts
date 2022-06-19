// ASHFAQ

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Coupon} from '../interfaces/coupon';

const API_COUPON = environment.apiBaseLink + '/api/coupon/';

@Injectable({
  providedIn: 'root'
})
export class CouponService {


  constructor(
    private http: HttpClient
  ) {
  }

  /**
   * COUPON
   * Admin
   */

  addNewCoupon(data: Coupon) {
    return this.http.post<{ message: string }>(API_COUPON + 'add-coupon', data);
  }

  getAllCoupons() {
    return this.http.get<{ data: Coupon[], message: String }>(API_COUPON + 'get-all-coupons');
  }

  deleteCoupon(couponId: String) {
    return this.http.delete<{ message: String }>(API_COUPON + 'delete-coupon/' + couponId);
  }

  editCoupon(couponId: String, data: Coupon){
    return this.http.put<{ message: string }>(API_COUPON + 'edit-coupon/' + couponId, data);
  }

  /**
   * COUPON
   * User
   */

  checkCoupon(couponCode: string) {
    return this.http.get<{ data: Coupon, message: String }>(API_COUPON + 'use-coupon/' + couponCode);
  }

  useCoupon(couponId: String){
    return this.http.put<{ message: string }>(API_COUPON + 'coupon-used/', {couponId});
  }



}

// ASHFAQ
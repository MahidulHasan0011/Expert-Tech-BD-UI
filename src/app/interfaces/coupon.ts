
export interface Coupon {
  _id?: string;
  couponName: string;
  couponAmount: number;
  couponCode: string;
  couponType: number;
  couponDiscountType: number;
  couponLimit: number;
  couponStartDate: Date;
  couponEndDate: Date;
  couponUsedByUser: any[];
}

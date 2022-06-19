import {Cart} from './cart';

export interface Checkout {
  _id?: string;
  userId: string;
  name: string;
  email: string;
  phoneNo: string;
  city: string;
  area: string;
  shippingAddress: string;
  subTotal: number;
  shippingFee: number;
  discount: number;
  couponId?: number;
  couponValue?: number;
  payable: number;
  cartProducts: Cart[];
  paymentType?: any;
  createdAt?: any;
  deliveryStatus?: string;
  status?: string;
}

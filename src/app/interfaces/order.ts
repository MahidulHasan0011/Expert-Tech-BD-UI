import {User} from './user';
import {Product} from './product';

export interface OrderItem {
  product: string | Product;
  price: number;
  discountType: number;
  discountAmount?: number;
  quantity: number;
  orderType: string;
}


export interface Order {
  _id?: string;
  orderId?: string;
  checkoutDate: Date;
  deliveryDate?: Date;
  deliveryStatus: number;
  subTotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  user?: string | User;
  name: string;
  phoneNo: string;
  email: string;
  alternativePhoneNo?: string;
  city: string;
  area: string;
  postCode: string;
  shippingAddress: string;
  couponId?: string | any;
  couponValue?: number;
  hasPreorderItem?: boolean;
  orderedItems: OrderItem[];
  orderNotes?: string;
  sessionkey?: string;
}

/*




 */

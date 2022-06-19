import {Product} from './product';


export interface UserCartDB {
  _id?: string;
  product: string | Product;
  userId?: string;
  selectedQty: number;
  orderType?: string;
}

import { Product } from './product';

export interface Cart {
  _id?: string;
  // product: Product | string;
  product: Product | string | any;
  selectedQty: number;
  user?: string;
}

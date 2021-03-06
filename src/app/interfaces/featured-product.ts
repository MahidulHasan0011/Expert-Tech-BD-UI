import {Product} from './product';

export interface FeaturedProduct{
  _id: string;
  type: string;
  priority: number;
  products: string[] | Product[];
}

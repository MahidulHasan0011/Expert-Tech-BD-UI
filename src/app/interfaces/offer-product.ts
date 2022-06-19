import {Product} from './product';

export interface OfferProduct {
  _id?: string;
  priorityNumber: number;
  tagName: string;
  tagSlug: string;
  product: string | Product;
}

import {Product} from './product';
import {Category} from './category';
import {PromotionalOffer} from './promotional-offer';

export interface PromotionalOfferProduct{
  _id: string;
  name: string;
  promotionalOffer: string | PromotionalOffer;
  promotionalOfferSlug?: string;
  category: string | Category;
  products: string[] | Product[];
  createdAt: Date;
}

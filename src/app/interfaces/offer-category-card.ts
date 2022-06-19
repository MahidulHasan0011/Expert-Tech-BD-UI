import { PromotionalOffer } from './promotional-offer';

export interface OfferCategoryCard {
  _id?: string;
  title: string;
  desc: string;
  url: string;
  image?: string;
  priorityNumber: number;
  promotionalOffer: string | PromotionalOffer;
}

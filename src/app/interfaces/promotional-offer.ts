export interface PromotionalOffer{
  _id?: string;
  title: string;
  slug: string;
  image?: string;
  shortDescription?: string;
  description?: string;
  campaignStartDate?: any;
  campaignStartTime?: any;
  campaignEndDate?: any;
  campaignEndTime?: string;
  createdAt?: Date;
}

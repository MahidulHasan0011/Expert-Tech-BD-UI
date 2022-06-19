import {Category} from './category';
import {Brand} from './brand';
import {SubCategory} from './sub-category';
import {ProductExtraData} from './product-extra-data';

export interface ImageFormat {
  big: string;
  medium: string;
  small: string;
}

export interface Product {
  _id?: string;
  name: string;
  slug: string;
  productImages?: string[];
  images?: ImageFormat[];
  regularPrice?: number;
  salePrice: number;
  discount?: number;
  discountType?: number;
  youtubeUrl?: string;
  isEMI: boolean;
  availableQuantity: number;
  productCode?: string;
  brand: string | Brand;
  category: string | Category;
  categorySlug: string;
  categoryName: string;
  subCategory: string | SubCategory;
  subCatSlug: string;
  subCatName: string;
  brandSlug?: string;
  brandName?: string;
  features: string[];
  filters?: object;
  extraData: string | ProductExtraData;
  select?: boolean;
  isCampaigned?: boolean;
}


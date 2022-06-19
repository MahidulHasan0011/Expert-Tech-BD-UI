import {Brand} from './brand';
import {SubCategory} from './sub-category';
import {Category} from './category';
import {BookImage} from './book-image';

export interface BookShort {
  _id?: string;
  name: string;
  slug: string;
  images?: BookImage;
  oldPrice?: number;
  newPrice: number;
  discount?: number;
  availableQuantity?: number;
  category?: string | Category;
  author?: string | Brand;
  publisher?: string | SubCategory;
}

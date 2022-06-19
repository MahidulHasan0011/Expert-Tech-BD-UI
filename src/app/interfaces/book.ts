import {Brand} from './brand';
import {SubCategory} from './sub-category';
import {Category} from './category';
import {BookImage} from './book-image';
import {BookSpecification} from './book-specification';

export interface Book {
  _id?: string;
  name: string;
  slug: string;
  images?: BookImage;
  description: string;
  specification: BookSpecification;
  oldPrice: number;
  newPrice: number;
  discount?: number;
  availableQuantity: number;
  ratingsCount?: number;
  ratingsValue?: number;
  productCode: string;
  category: string | Category;
  author: string | Brand;
  publisher: string | SubCategory;
  tag?: string[];
  reviews?: string[];

}

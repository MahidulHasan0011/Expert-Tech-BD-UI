import {Category} from './category';

export interface SubCategory {
  _id?: string;
  subCatName: string;
  parentCategory?: string | Category;
  parentCategoryName?: string;
  slug: string;
  priceRange?: any;
  filters?: any[];
}

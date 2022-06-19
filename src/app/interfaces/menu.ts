import {MenuChild} from './menu-child';

export interface Menu {
  _id?: string;
  categoryName: string;
  categoryId: string;
  slug: string;
  subCategories?: MenuChild[];
  priority?: number;
}

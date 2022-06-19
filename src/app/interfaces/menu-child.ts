import {MenuGrandChild} from './menu-grand-child';

export interface MenuChild {
  subCatId: string;
  subCatName: string;
  slug: string;
  brands?: MenuGrandChild[];
  priority?: number;
}

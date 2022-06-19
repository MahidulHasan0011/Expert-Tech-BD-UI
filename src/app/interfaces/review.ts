import {User} from './user';
import {Product} from './product';

export interface Review {
  title?: string;
  text: string;
  rating: number;
  createdAt?: Date;
  product?: string | Product;
  userId?: string | User;
}

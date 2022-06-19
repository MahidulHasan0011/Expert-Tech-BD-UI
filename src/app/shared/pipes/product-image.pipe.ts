import { Pipe, PipeTransform } from '@angular/core';
import { Product } from 'src/app/interfaces/product';

@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {
  transform(product: Product, type: string): any {
    if (product) {
      if (type === 'single') {
        if (product.productImages && product.productImages.length) {
          return product.productImages[0];
        } else if (product.images && product.images.length) {
          return product.images[0].big;
        } else {
          return '/assets/images/png/image-placeholder-r1.png';
        }
      } else {
        if (product.productImages && product.productImages.length) {
          return product.productImages;
        } else if (product.images && product.images.length) {
          const images = product.images.map((item) => {
            let container = {};

            container = item.big;

            return container;
          });
          return images;
        } else {
          return ['/assets/images/png/image-placeholder-r1.png'];
        }
      }
    }
  }
}

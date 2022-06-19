import {Pipe, PipeTransform} from '@angular/core';
import {Product} from '../../interfaces/product';
import {DiscountTypeEnum} from '../../enum/discount-type.enum';

@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {

  transform(product: Product, type: string, quantity?: number): number {

    switch (type) {
      case 'priceWithDiscount': {
        if (product.discountType && (product.discountType === DiscountTypeEnum.PERCENTAGE)) {
          const disPrice = (product?.discount / 100) * product?.salePrice;
          if (quantity) {
            return Math.floor((product?.salePrice - disPrice) * quantity);
          }
          return Math.floor(product?.salePrice - disPrice);
        } else {
          if (quantity) {
            return Math.floor((product?.salePrice - product.discount) * quantity);
          }
          return Math.floor(product?.salePrice - product.discount);
        }
      }
      case 'discountPrice': {
        if (product.discountType && (product.discountType === DiscountTypeEnum.PERCENTAGE)) {
          if (quantity) {
            return ((product?.discount / 100) * product?.salePrice) * quantity;
          }
          return (product?.discount / 100) * product?.salePrice;
        } else {
          if (quantity) {
            return product?.discount * quantity;
          }
          return product?.discount;
        }
      }
      default: {
        return product?.salePrice;
      }
    }

  }

}

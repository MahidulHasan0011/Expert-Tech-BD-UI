import {Pipe, PipeTransform} from '@angular/core';
import {UserCartDB} from '../../interfaces/user-cart';
import {Product} from '../../interfaces/product';

@Pipe({
  name: 'cartPrice'
})
export class CartPricePipe implements PipeTransform {

  transform(item: UserCartDB, type?: string): unknown {

    const itemBook = item.product as Product;


    return 0;

    // switch (type) {
    //   case 'priceWithDiscount': {
    //     const disPrice = (itemBook.discount / 100) * itemBook.salePrice;
    //     return Math.floor(itemBook.salePrice - disPrice) * item.selectedQty;
    //   }
    //   case 'discountPrice': {
    //     const disPrice = (itemBook.discountPercent / 100) * itemBook.price;
    //     return disPrice * item.selectedQty;
    //   }
    //   case 'formatPrice': {
    //     if (item.format) {
    //       // @ts-ignore
    //       const format = itemBook.priceData.priceExtra.find(f => f.format === item.format);
    //       const formatCondition = format.condition.find(c => c.name === item.formatCondition) as BookPriceData;
    //
    //       return formatCondition.price * item.selectedQty;
    //     } else {
    //       return 0;
    //     }
    //   }
    //   case 'formatPriceWithDiscount': {
    //     if (item.format) {
    //       // @ts-ignore
    //       const format = itemBook.priceData.priceExtra.find(f => f.format === item.format);
    //       const formatCondition = format.condition.find(c => c.name === item.formatCondition) as BookPriceData;
    //
    //       const disPrice = (formatCondition.discount / 100) * formatCondition.price;
    //       return Math.floor(formatCondition.price - disPrice) * item.selectedQty;
    //     } else {
    //       return 0;
    //     }
    //   }
    //   case 'formatDiscountPrice': {
    //     if (item.format) {
    //       // @ts-ignore
    //       const format = itemBook.priceData.priceExtra.find(f => f.format === item.format);
    //       const formatCondition = format.condition.find(c => c.name === item.formatCondition) as BookPriceData;
    //
    //       const disPrice = (formatCondition.discount / 100) * formatCondition.price;
    //       return Math.floor(disPrice * item.selectedQty);
    //     } else {
    //       return 0;
    //     }
    //   }
    //   default: {
    //     return itemBook.price * item.selectedQty;
    //   }
    // }

  }

}

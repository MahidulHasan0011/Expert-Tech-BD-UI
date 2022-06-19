import {Pipe, PipeTransform} from '@angular/core';
import {OrderStatus} from '../../enum/order-status';

@Pipe({
  name: 'orderStatus'
})
export class OrderStatusPipe implements PipeTransform {

  transform(status: number, type?: string): unknown {

    switch (status) {
      case OrderStatus.PROCESSING : {
        return 'Processing';
      }
      case OrderStatus.PENDING : {
        return 'Pending';
      }
      case OrderStatus.REFUND : {
        return 'Refund';
      }
      case OrderStatus.CANCEL : {
        return 'Cancel';
      }
      case OrderStatus.DELIVERED : {
        return 'Delivered';
      }
      case OrderStatus.CONFIRM : {
        return 'Confirm';
      }
      case OrderStatus.SHIPPING : {
        return 'Shipping';
      }
      default: {
        return '-';
      }
    }

  }
}

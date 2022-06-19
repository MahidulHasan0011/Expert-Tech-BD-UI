import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Cart} from '../../../interfaces/cart';
import {UserDataService} from '../../../services/user-data.service';
import {ReloadService} from '../../../services/reload.service';
import {UserService} from '../../../services/user.service';
import {UiService} from '../../../services/ui.service';
import {DATABASE_KEY} from '../../../core/utils/global-variable';
import {Product} from '../../../interfaces/product';
import {CartService} from '../../../services/cart.service';
import {ProductService} from '../../../services/product.service';
import {PricePipe} from '../../../shared/pipes/price.pipe';
import {ShippingCharge} from '../../../interfaces/shippingcharge';
import {ShippingChargeService} from '../../../services/shipping-charge';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [PricePipe]
})
export class CartComponent implements OnInit {

  carts: Cart[] = [];
  shippingchargedata: ShippingCharge;

  constructor(
    private router: Router,
    private userDataService: UserDataService,
    private reloadService: ReloadService,
    private userService: UserService,
    private uiService: UiService,
    private cartService: CartService,
    private productService: ProductService,
    private pricePipe: PricePipe,
    private shippingChargeService: ShippingChargeService
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshCart$.subscribe(() => {
      this.getCartsItems();
    });
    this.getCartsItems();
    this.getShippingCharge();

  }

  /**
   * CART DATA
   */
  private getCartsItems() {
    if (this.userService.getUserStatus()) {
      this.getCartItemList();
    } else {
      this.getCarsItemFromLocal();
    }

  }

  private getCarsItemFromLocal() {
    const items = this.cartService.getCartItemFromLocalStorage();

    if (items && items.length > 0) {
      const ids: string[] = items.map(m => m.product as string);
      this.productService.getSpecificProductsById(ids, 'name slug salePrice discount discountType quantity images productImages')
        .subscribe(res => {
          const products = res.data;
          if (products && products.length > 0) {
            this.carts = items.map(t1 => ({...t1, ...{product: products.find(t2 => t2._id === t1.product)}}));
            console.log(this.carts);
          }
        });
    } else {
      this.carts = [];
    }
  }


  /**
   * CART FUNCTIONALITY
   */
  onDeleteCartItem(cartId: string, product: string) {
    console.log(cartId)
    if (this.userService.getUserStatus()) {
      this.removeCartItem(cartId);
    } else {
      this.cartService.deleteCartItemFromLocalStorage(product);
      this.reloadService.needRefreshCart$();
    }
  }


  /**
   * LOGICAL METHODS
   */

  incrementQty(cartId: string, index: number) {
    if (this.userService.getUserStatus()) {
      this.incrementCartQtyDB(cartId);
    } else {
      const data = this.cartService.getCartItemFromLocalStorage();
      if (data != null) {
        data[index].selectedQty = data[index].selectedQty + 1;
        localStorage.setItem(DATABASE_KEY.userCart, JSON.stringify(data));
        this.reloadService.needRefreshCart$();
      }
    }
  }

  decrementQty(cartId: string, index: number, sQty: number) {
    if (this.userService.getUserStatus()) {
      if (sQty === 1) {
        this.uiService.warn('Minimum quantity is 1');
        return;
      }
      this.decrementCartQtyDB(cartId);
    } else {
      const data = this.cartService.getCartItemFromLocalStorage();
      if (data[index].selectedQty === 1) {
        return;
      }
      if (data != null) {
        data[index].selectedQty = data[index].selectedQty - 1;
        localStorage.setItem(DATABASE_KEY.userCart, JSON.stringify(data));
        this.reloadService.needRefreshCart$();
      }
    }

  }

  /**
   * CALCULATION
   */

  get cartSubTotal() {
    return this.carts.map(t => {
      return this.pricePipe.transform(t.product as Product, 'priceWithDiscount', t.selectedQty) as number;
    }).reduce((acc, value) => acc + value, 0);
  }


  get totalCartAmount(): number {
    if (this.carts && this.carts.length > 0) {
      return this.carts.map((t: Cart) => {
        const product = t.product as Product;
        return product.salePrice * t.selectedQty;
      }).reduce((acc: any, value: any) => acc + value, 0);
    } else {
      return 0;
    }
  }

  //
  // get totalAmount(): number {
  //   return this.carts.map(t => t.product.price * t.selectedQty).reduce((acc, value) => acc + value, 0);
  //   return 0;
  // }

  get totalSave(): number {
    // const old = this.cartsItems.map(t => t.product.price * t.selectedQty).reduce((acc, value) => acc + value, 0);
    // return old - this.totalAmount;
    return 0;
  }
  /* checkout */
  onProceedToCheckOut(){
   const isUser = this.userService.getUserStatus();
   if(isUser){
     console.log("User")
     this.router.navigate(['/auth-checkout'])
    }
    else{
     this.router.navigate(['/auth-checkout'])
     console.log("Not User")
   }
    
  }
  /**
   * HTTP REQ HANDLE
   */
  private getShippingCharge() {
    this.shippingChargeService.getExtraPriceInfo()
      .subscribe(res => {
        this.shippingchargedata = res.data;
      }, err => {
        console.log(err);
      });
  }

  private getCartItemList() {
    this.cartService.getCartItemList()
      .subscribe(res => {
        console.log(res.data)
        this.carts = res.data;
      }, error => {
        console.log(error);
      });
  }

  private removeCartItem(cartId: string) {
    this.cartService.removeCartItem(cartId)
      .subscribe(() => {
        this.reloadService.needRefreshCart$();
      }, error => {
        console.log(error);
      });
  }

  private incrementCartQtyDB(cartId: string) {
    this.cartService.incrementCartQuantity(cartId)
      .subscribe(() => {
        this.reloadService.needRefreshCart$();
      }, error => {
        console.log(error);
      });
  }

  private decrementCartQtyDB(cartId: string) {
    this.cartService.decrementCartQuantity(cartId)
      .subscribe(() => {
        this.reloadService.needRefreshCart$();
      }, error => {
        console.log(error);
      });
  }


  showDevMsg() {
    this.uiService.warn('Coupon is disable by r one computer');
  }
}

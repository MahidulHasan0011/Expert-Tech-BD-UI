import {Component, Input, OnInit} from '@angular/core';
import {Product} from '../../../interfaces/product';
import {Router} from '@angular/router';
import {CartService} from '../../../services/cart.service';
import {ReloadService} from '../../../services/reload.service';
import {Cart} from '../../../interfaces/cart';
import {UserService} from '../../../services/user.service';
import {UiService} from '../../../services/ui.service';
import {ProductService} from '../../../services/product.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmOrderComponent} from '../../dialog-view/confirm-order/confirm-order.component'

@Component({
  selector: 'app-product-card-one',
  templateUrl: './product-card-one.component.html',
  styleUrls: ['./product-card-one.component.scss']
})
export class ProductCardOneComponent implements OnInit {

  @Input() product: Product = null;

  // CARTS
  @Input() carts: Cart[] = [];

  existsInCart = false;

  constructor(
    private router: Router,
    private cartService: CartService,
    private reloadService: ReloadService,
    private userService: UserService,
    private uiService: UiService,
    private productService: ProductService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    // this.checkCartsItems();
    console.log('this is app product card one product')
    // console.log(this.product.name)
  }

  /**
   * CLICK With Event
   */

  addToCart(event: MouseEvent) {
    if (event) {
      event.preventDefault();
    }

    const data: Cart = {
      product: this.product?._id,
      selectedQty: 1,
    };



    const dialogRef = this.dialog.open(ConfirmOrderComponent, {
      maxWidth: '800px',
      data: {data}
    });
    dialogRef.afterClosed().subscribe(dialogResult => {

      if (dialogResult) {
        // this.addNewMenu();
      }
    });


    if (this.userService.getUserStatus()) {
      this.addItemToCartDB(data);
    } else {
      this.cartService.addCartItemToLocalStorage(data);
      this.reloadService.needRefreshCart$();
    }
  }


  /**
   * HTTP REQ HANDLE
   */

  addItemToCartDB(data: Cart) {
    this.cartService.addItemToUserCart(data)
      .subscribe(res => {
        // console.log(res);
        this.uiService.success(res.message);
        this.reloadService.needRefreshCart$();
      }, error => {
        console.log(error);
      });
  }


  onNavigate(url?: string) {
    this.router.navigate(['/product/' + this.product.slug]);
  }

  viewInCart(event: MouseEvent) {
    event.stopPropagation();
    this.router.navigate(['/cart']);
  }

  addToCompareList(event: MouseEvent, product: Product) {
    event.stopPropagation();
    this.productService.addToCompare(product);
    this.reloadService.needRefreshCompareList$();
  }


}

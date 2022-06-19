import { Component, OnInit, Inject  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Cart} from '../../../interfaces/cart';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from '../../../services/product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {Router} from '@angular/router';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.scss']
})
export class ConfirmOrderComponent implements OnInit {


  constructor(
    private router: Router,
    public productService: ProductService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<ConfirmOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  cart: Cart = this.data.data;
  productId: string = this.data.data.product;
  product: Product = null;

  ngOnInit(): void {
    this.getSingleProductById(this.productId);
  }


  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

  goToCart(){

    this.router.navigate(['/cart'])
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

   public getSingleProductById(id: string) {
    this.spinner.show();
    this.productService.getSingleProductById(id).subscribe(
      (res) => {
        this.product = res.data;
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }
}

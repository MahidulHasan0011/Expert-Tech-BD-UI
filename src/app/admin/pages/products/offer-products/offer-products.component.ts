import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {OfferProduct} from "../../../../interfaces/offer-product";
import {ShopService} from "../../../../services/shop.service";
import {ReloadService} from "../../../../services/reload.service";
import {UiService} from "../../../../services/ui.service";
import {ConfirmDialogComponent} from "../../../../shared/components/ui/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-offer-products',
  templateUrl: './offer-products.component.html',
  styleUrls: ['./offer-products.component.scss']
})
export class OfferProductsComponent implements OnInit {

  offerProducts: OfferProduct[] = [];

  constructor(
    private shopService: ShopService,
    private reloadService: ReloadService,
    private uiService: UiService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshOfferProduct$.subscribe(() => {
      this.getAllOfferProduct();
    });
    this.getAllOfferProduct();
  }

  /**
   * DIALOG
   */
  public remove(prodId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Action',
        message: 'Are you sure you want remove this product?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteOfferProductById(prodId);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllOfferProduct() {
    this.shopService.getAllOfferProduct()
      .subscribe(res => {
        this.offerProducts = res.data;
      }, error => {
        console.log(error);
      });
  }

  private deleteOfferProductById(id: string) {
    this.shopService.deleteOfferProductById(id)
      .subscribe(res => {
        this.reloadService.needRefreshOfferProduct$();
        this.uiService.success(res.message);
      }, error => {
        this.uiService.wrong(error.message);
        console.log(error);
      });
  }

  /**
   * ROUTER LINK
   */
  navigateTo(path: string){
    this.router.navigate([path], {relativeTo: this.route});
  }



}

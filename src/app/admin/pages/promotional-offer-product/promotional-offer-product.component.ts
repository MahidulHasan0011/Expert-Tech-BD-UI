import { Component, OnInit } from '@angular/core';
import {PromotionalOfferProduct} from "../../../interfaces/promotional-offer-product";
import {MatDialog} from "@angular/material/dialog";
import {UiService} from "../../../services/ui.service";
import {ReloadService} from "../../../services/reload.service";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {Product} from "../../../interfaces/product";
import {ProductViewTableOneComponent} from "../components/product-view-table-one/product-view-table-one.component";
import {PromotionalOfferProductService} from "../../../services/promotional-offer-product.service";

@Component({
  selector: 'app-promotional-offer-product',
  templateUrl: './promotional-offer-product.component.html',
  styleUrls: ['./promotional-offer-product.component.scss']
})
export class PromotionalOfferProductComponent implements OnInit {

  allPromotionalOfferProducts: PromotionalOfferProduct[] = [];

  constructor(
    private dialog: MatDialog,
    private uiService: UiService,
    private reloadService: ReloadService,
    private promotionalOfferProductService: PromotionalOfferProductService
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshPromotionalOfferProduct$.subscribe(() => {
      this.getAllPromotionalOfferProduct();
    });
    this.getAllPromotionalOfferProduct();
  }

  /**
   * COMPONENT DIALOG VIEW
   */
  public openConfirmDialog(id?: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this category?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deletePromotionalOfferProductById(id);
      }
    });
  }

  /**
   * OPEN COMPONENT DIALOG
   */

  public openComponentDialog(products: Product[]) {
    console.log(products);
    const dialogRef = this.dialog.open(ProductViewTableOneComponent, {
      data: products,
      panelClass: ['theme-dialog', 'full-screen-modal'],
      width: '100%',
      maxHeight: '90vh',
      autoFocus: false,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        // TODO IF CLOSE
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllPromotionalOfferProduct() {
    this.promotionalOfferProductService.getAllPromotionalOfferProduct()
      .subscribe(res => {
        this.allPromotionalOfferProducts = res.data;
      }, error => {
        console.log(error);
      });
  }

  private deletePromotionalOfferProductById(id: string) {
    this.promotionalOfferProductService.deletePromotionalOfferProductById(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshOfferProduct$();
      }, error => {
        console.log(error);
      });
  }

}

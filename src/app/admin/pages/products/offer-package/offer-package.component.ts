import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {OfferPackage} from "../../../../interfaces/offer-package";
import {ShopService} from "../../../../services/shop.service";
import {ReloadService} from "../../../../services/reload.service";
import {UiService} from "../../../../services/ui.service";
import {ConfirmDialogComponent} from "../../../../shared/components/ui/confirm-dialog/confirm-dialog.component";


@Component({
  selector: 'app-offer-package',
  templateUrl: './offer-package.component.html',
  styleUrls: ['./offer-package.component.scss']
})
export class OfferPackageComponent implements OnInit {

  offerPackages: OfferPackage[] = [];

  constructor(
    private shopService: ShopService,
    private reloadService: ReloadService,
    private uiService: UiService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshOfferProduct$.subscribe(() => {
      this.getAllOfferPackage();
    });
    this.getAllOfferPackage();
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
        this.deleteOfferPackageById(prodId);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllOfferPackage() {
    this.shopService.getAllOfferPackage()
      .subscribe(res => {
        this.offerPackages = res.data.reverse();
      }, error => {
        console.log(error);
      });
  }

  private deleteOfferPackageById(id: string) {
    this.shopService.deleteOfferPackageById(id)
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
  navigateTo(path: string) {
    this.router.navigate([path], {relativeTo: this.route});
  }


}

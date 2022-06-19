import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {TabLabelDialogComponent} from './tab-label-dialog/tab-label-dialog.component';
import {forkJoin} from 'rxjs';
import {OfferBanner} from "../../../../interfaces/offer-banner";
import {ShopService} from "../../../../services/shop.service";
import {UiService} from "../../../../services/ui.service";
import {ReloadService} from "../../../../services/reload.service";
import {FileUploadService} from "../../../../services/file-upload.service";
import {ConfirmDialogComponent} from "../../../../shared/components/ui/confirm-dialog/confirm-dialog.component";


@Component({
  selector: 'app-offer-tab',
  templateUrl: './offer-tab.component.html',
  styleUrls: ['./offer-tab.component.scss']
})
export class OfferTabComponent implements OnInit {

  offerBanners: OfferBanner[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private shopService: ShopService,
    private uiService: UiService,
    private dialog: MatDialog,
    private reloadService: ReloadService,
    private fileUploadService: FileUploadService,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshOfferTab$.subscribe(() => {
      this.getAllOfferBanner();
    });

    this.getAllOfferBanner();
  }


  /**
   * OPEN ADD LABEL DIALOG
   * CONFIRM DIALOG
   */
  public openLabelDialog() {
    this.dialog.open(TabLabelDialogComponent, {
      panelClass: ['theme-dialog'],
      autoFocus: false,
      disableClose: true
    });
  }

  public openConfirmDialog(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this carousel?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteOfferBannerTabById(id);
      }
    });
  }

  public openDeleteOfferConfirmDialog(offerBanner: OfferBanner) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this offer banner?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.removeOfferData(offerBanner);
      }
    });
  }


  /**
   * HTTP REQ HANDLE
   */

  private getAllOfferBanner() {
    this.shopService.getAllOfferBanner()
      .subscribe(res => {
        this.offerBanners = res.data;
      }, error => {
        console.log(error);
      });
  }

  private deleteOfferBannerTabById(id: string) {
    this.shopService.deleteOfferBannerTabById(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshOfferTab$();
      }, error => {
        console.log(error);
      });
  }

  // private removeOfferData(bannerId: string, offerId: string) {
  //   this.shopService.removeOfferData(bannerId, offerId)
  //     .subscribe(res => {
  //       this.uiService.success(res.message);
  //       this.reloadService.needRefreshOfferTab$();
  //     }, error => {
  //       console.log(error);
  //     });
  // }

  /**
   * ROUTER LINK
   */
  navigateTo(path: string) {
    this.router.navigate([path], {relativeTo: this.route});
  }


  /**
   * PARALLEL HTTP REQ HANDLE
   */

  private removeOfferData(offerBanners: OfferBanner) {
    const productPromise = this.shopService.deleteOfferBannerTabById(offerBanners._id);
    const imagePromise = this.fileUploadService.removeSingleFile({url: offerBanners.image});

    forkJoin([productPromise, imagePromise]).subscribe(results => {
      this.uiService.success(results[0].message);
      this.reloadService.needRefreshOfferTab$();
    });
  }

}

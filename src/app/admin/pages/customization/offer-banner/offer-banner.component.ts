import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

import {forkJoin} from 'rxjs';
import {OfferBannerCard} from "../../../../interfaces/offer-banner-card";
import {ShopService} from "../../../../services/shop.service";
import {FileUploadService} from "../../../../services/file-upload.service";
import {UiService} from "../../../../services/ui.service";
import {ReloadService} from "../../../../services/reload.service";
import {ConfirmDialogComponent} from "../../../../shared/components/ui/confirm-dialog/confirm-dialog.component";


@Component({
  selector: 'app-offer-banner',
  templateUrl: './offer-banner.component.html',
  styleUrls: ['./offer-banner.component.scss']
})
export class OfferBannerComponent implements OnInit {

  offerBannerCards: OfferBannerCard[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private shopService: ShopService,
    private fileUploadService: FileUploadService,
    private uiService: UiService,
    private dialog: MatDialog,
    private reloadService: ReloadService,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshOfferBannerCard$.subscribe(() => {
      this.getAllOfferBannerCard();
    });

    this.getAllOfferBannerCard();
  }


  /**
   * CONFIRM DIALOG
   */
  public openConfirmDialog(carousel: OfferBannerCard) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this banner?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteCarouselById(carousel);
      }
    });
  }


  /**
   * HTTP REQ HANDLE
   */

  private getAllOfferBannerCard() {
    this.shopService.getAllOfferBannerCard()
      .subscribe(res => {
        this.offerBannerCards = res.data;
      }, error => {
        console.log(error);
      });
  }

  // private deleteCarouselById(id: string) {
  //   this.shopService.deleteCarouselById(id)
  //     .subscribe(res => {
  //       this.uiService.success(res.message);
  //       this.reloadService.needRefreshCarousel$();
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

  private deleteCarouselById(offerBannerCard: OfferBannerCard) {
    const productPromise = this.shopService.deleteOfferBannerCardById(offerBannerCard._id);
    const imagePromise = this.fileUploadService.removeSingleFile({url: offerBannerCard.image});

    forkJoin([productPromise, imagePromise]).subscribe(results => {
      this.uiService.success(results[0].message);
      this.reloadService.needRefreshOfferBannerCard$();
    });
  }

}

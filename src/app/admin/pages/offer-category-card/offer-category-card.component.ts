import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddOfferCategoryOfferComponent } from './add-offer-category-offer/add-offer-category-offer.component';
import { forkJoin } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { AppSettings, Settings } from '../../../app.settings';
import { AppService } from '../../../app.service';
import { ProductService } from '../../../services/product.service';
import { FileUploadService } from '../../../services/file-upload.service';
import { ReloadService } from '../../../services/reload.service';
import { UiService } from '../../../services/ui.service';
import { OfferCategoryCard } from '../../../interfaces/offer-category-card';
import { ConfirmDialogComponent } from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import { OfferCategoryCardService } from '../../../services/offer-category-card.service';

@Component({
  selector: 'app-offer-category-card',
  templateUrl: './offer-category-card.component.html',
  styleUrls: ['./offer-category-card.component.scss'],
})
export class OfferCategoryCardComponent implements OnInit {
  allOfferCategoryCard: OfferCategoryCard[] = [];
  public page: any;
  public count = 10;
  public settings: Settings;

  constructor(
    public appService: AppService,
    public dialog: MatDialog,
    public appSettings: AppSettings,
    private productService: ProductService,
    private offerCategoryCardService: OfferCategoryCardService,
    private fileUploadService: FileUploadService,
    private reloadService: ReloadService,
    @Inject(PLATFORM_ID) public platformId: any,
    private uiService: UiService // @Inject(PLATFORM_ID) public platformId: any
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    this.reloadService.refreshPromotionalOffer$.subscribe(() => {
      this.getAllOfferCategoryCard();
    });
    this.getAllOfferCategoryCard();
  }
  public onPageChanged(event) {
    this.page = event;
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  public remove(brand: OfferCategoryCard) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Action',
        message: 'Are you sure you want remove this author?',
      },
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        // if (brand.image !== null) {
        //   this.deleteBrandWithImage(brand)
        // } else {
        //   this.deletePromotionalOfferById(brand._id);
        // }
        this.deletePromotionalOfferById(brand._id);
      }
    });
  }
  /**
   * HTTP REQ HANDLE
   */
  private getAllOfferCategoryCard() {
    this.offerCategoryCardService.getAllOfferCategoryCard().subscribe(
      (res) => {
        this.allOfferCategoryCard = res.data;
        console.log(res.data);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  private deletePromotionalOfferById(id: string) {
    this.offerCategoryCardService.deleteOfferCategoryCardById(id).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshPromotionalOffer$();
      },
      (error) => {
        console.log(error);
      }
    );
  }
}

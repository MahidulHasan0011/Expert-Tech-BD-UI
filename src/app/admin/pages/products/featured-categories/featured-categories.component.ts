import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FeaturedCategoriesDialogComponent } from './featured-categories-dialog/featured-categories-dialog.component';
import { forkJoin } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { AppSettings, Settings } from '../../../../app.settings';
import { AppService } from '../../../../app.service';
import { ProductService } from '../../../../services/product.service';
import { FileUploadService } from '../../../../services/file-upload.service';
import { ReloadService } from '../../../../services/reload.service';
import { UiService } from '../../../../services/ui.service';
import { FeaturedCategory } from '../../../../interfaces/featured-category';
import { ConfirmDialogComponent } from '../../../../shared/components/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-featured-categories',
  templateUrl: './featured-categories.component.html',
  styleUrls: ['./featured-categories.component.scss'],
})
export class FeaturedCategoriesComponent implements OnInit {
  public featuredCategory: any[] = [];
  public page: any;
  public count = 10;
  public settings: Settings;

  constructor(
    public appService: AppService,
    public dialog: MatDialog,
    public appSettings: AppSettings,
    private productService: ProductService,
    private fileUploadService: FileUploadService,
    private reloadService: ReloadService,
    private uiService: UiService,
    @Inject(PLATFORM_ID) public platformId: any
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    this.reloadService.refreshFeaturedCategory$.subscribe(() => {
      this.getFeaturedCategoryList();
    });
    this.getFeaturedCategoryList();
  }

  public onPageChanged(event) {
    this.page = event;
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  public openFeaturedCategoryDialog(data?: FeaturedCategory) {
    this.dialog.open(FeaturedCategoriesDialogComponent, {
      data: {
        author: data,
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      disableClose: true,
    });
  }

  public remove(brand: FeaturedCategory) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Action',
        message: 'Are you sure you want remove this Featured Category?',
      },
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        if (brand.image !== null) {
          this.deleteFeaturedCategoryWithImage(brand);
        } else {
          this.deleteFeaturedCategory(brand._id);
        }
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getFeaturedCategoryList() {
    this.productService.getAllFeaturedCategoryList().subscribe(
      (res) => {
        this.featuredCategory = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private deleteFeaturedCategory(id: string) {
    this.productService.deleteFeaturedCategory(id).subscribe(
      (res) => {
        this.reloadService.needRefreshFeaturedCategory$();
        this.uiService.success(res.message);
      },
      (error) => {
        this.uiService.wrong(error.message);
        console.log(error);
      }
    );
  }

  /**
   * PARALLEL HTTP REQ HANDLE
   */

  private deleteFeaturedCategoryWithImage(brand: FeaturedCategory) {
    const productPromise = this.productService.deleteFeaturedCategory(
      brand._id
    );
    const imagePromise = this.fileUploadService.removeSingleFile({
      url: brand.image,
    });

    forkJoin([productPromise, imagePromise]).subscribe((results) => {
      this.uiService.success(results[0].message);
      this.reloadService.needRefreshFeaturedCategory$();
    });
  }
}

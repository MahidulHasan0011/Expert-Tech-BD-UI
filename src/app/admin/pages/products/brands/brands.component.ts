import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {BrandDialogComponent} from './brand-dialog/brand-dialog.component';
import {forkJoin} from 'rxjs';
import {isPlatformBrowser} from '@angular/common';
import {AppSettings, Settings} from "../../../../app.settings";
import {AppService} from "../../../../app.service";
import {ProductService} from "../../../../services/product.service";
import {FileUploadService} from "../../../../services/file-upload.service";
import {ReloadService} from "../../../../services/reload.service";
import {UiService} from "../../../../services/ui.service";
import {Brand} from "../../../../interfaces/brand";
import {ConfirmDialogComponent} from "../../../../shared/components/ui/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-authors',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {

  public authors: any[] = [];
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
    this.reloadService.refreshAuthor$.subscribe(() => {
      this.getAuthorList();
    });
    this.getAuthorList();
  }


  public onPageChanged(event) {
    this.page = event;
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  public openAuthorDialog(data?: Brand) {
    this.dialog.open(BrandDialogComponent, {
      data: {
        author: data
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      disableClose: true
    });
  }



  public remove(brand: Brand) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Action',
        message: 'Are you sure you want remove this author?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (brand.image !== null) {
          this.deleteBrandWithImage(brand)
        } else {
          this.deleteBrand(brand._id);
        }
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAuthorList() {
    this.productService.getAllBrandList()
      .subscribe(res => {
        this.authors = res.data;
      }, error => {
        console.log(error);
      });
  }

  private deleteBrand(id: string) {
    this.productService.deleteBrand(id)
      .subscribe(res => {
        this.reloadService.needRefreshAuthor$();
        this.uiService.success(res.message);
      }, error => {
        this.uiService.wrong(error.message);
        console.log(error);
      });
  }


  /**
   * PARALLEL HTTP REQ HANDLE
   */

  private deleteBrandWithImage(brand: Brand) {
    const productPromise = this.productService.deleteBrand(brand._id);
    const imagePromise = this.fileUploadService.removeSingleFile({url: brand.image});

    forkJoin([productPromise, imagePromise]).subscribe(results => {
      this.uiService.success(results[0].message);
      this.reloadService.needRefreshAuthor$();
    });
  }

}

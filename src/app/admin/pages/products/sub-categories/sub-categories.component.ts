import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {SubCategoryDialogComponent} from './sub-category-dialog/sub-category-dialog.component';
import {ActivatedRoute, Router} from '@angular/router';
import {isPlatformBrowser} from '@angular/common';
import {SubCategory} from "../../../../interfaces/sub-category";
import {AppSettings, Settings} from "../../../../app.settings";
import {AppService} from "../../../../app.service";
import {ProductService} from "../../../../services/product.service";
import {ReloadService} from "../../../../services/reload.service";
import {UiService} from "../../../../services/ui.service";
import {ConfirmDialogComponent} from "../../../../shared/components/ui/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-publishers',
  templateUrl: './sub-categories.component.html',
  styleUrls: ['./sub-categories.component.scss']
})
export class SubCategoriesComponent implements OnInit {

  public subCategories: SubCategory[] = [];
  public page: any;
  public count = 10;
  public settings: Settings;

  constructor(
    public appService: AppService,
    public dialog: MatDialog,
    public appSettings: AppSettings,
    private productService: ProductService,
    private reloadService: ReloadService,
    private uiService: UiService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) public platformId: any
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    this.reloadService.refreshPublisher$.subscribe(() => {
      this.getSubCategoryList();
    });
    this.getSubCategoryList();
  }


  public onPageChanged(event) {
    this.page = event;
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  public openSubCatDialog(data?: SubCategory) {
    this.dialog.open(SubCategoryDialogComponent, {
      data: {
        publisher: data
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      disableClose: true
    });
  }


  public remove(categoryId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Action',
        message: 'Are you sure you want remove this category?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteCategory(categoryId);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getSubCategoryList() {
    this.productService.getAllSubCategoryList()
      .subscribe(res => {
        this.subCategories = res.data;
      }, error => {
        console.log(error);
      });
  }

  private deleteCategory(id: string) {
    this.productService.deleteSubCategory(id)
      .subscribe(res => {
        this.reloadService.needRefreshPublisher$();
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

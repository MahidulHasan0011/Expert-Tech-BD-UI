import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {AppService} from 'src/app/app.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from 'src/app/shared/components/ui/confirm-dialog/confirm-dialog.component';
import {AppSettings, Settings} from 'src/app/app.settings';
import {ActivatedRoute, Router} from '@angular/router';
import {AddCategoryComponent} from './add-category-dialog/add-category.component';
import {isPlatformBrowser} from '@angular/common';
import {Category} from "../../../../interfaces/category";
import {ProductService} from "../../../../services/product.service";
import {ReloadService} from "../../../../services/reload.service";
import {UiService} from "../../../../services/ui.service";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  public categories: Category[] = [];
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
    this.reloadService.refreshCategory$.subscribe(() => {
      this.getCategoryList();
    });
    this.getCategoryList();
  }


  public onPageChanged(event) {
    this.page = event;
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  public openCategoryDialog(data?: Category) {
    this.dialog.open(AddCategoryComponent, {
      data: {
        category: data
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      disableClose: true
    });
  }



  public remove(categoryId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '800px',
      maxHeight: '600px',

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

  private getCategoryList() {
    this.productService.getAllCategoryList()
      .subscribe(res => {
       this.categories = res.data;
      }, error => {
        console.log(error);
      });
  }

  private deleteCategory(id: string) {
    this.productService.deleteCategory(id)
      .subscribe(res => {
        this.reloadService.needRefreshCat$();
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

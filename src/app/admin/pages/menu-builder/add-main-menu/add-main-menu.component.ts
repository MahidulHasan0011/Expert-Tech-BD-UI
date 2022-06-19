import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSelectChange} from '@angular/material/select';
import {MatDialog} from '@angular/material/dialog';
import {Menu} from "../../../../interfaces/menu";
import {Category} from "../../../../interfaces/category";
import {SubCategory} from "../../../../interfaces/sub-category";
import {Brand} from "../../../../interfaces/brand";
import {ProductService} from "../../../../services/product.service";
import {ShopService} from "../../../../services/shop.service";
import {UiService} from "../../../../services/ui.service";
import {ReloadService} from "../../../../services/reload.service";
import {ConfirmDialogComponent} from "../../../../shared/components/ui/confirm-dialog/confirm-dialog.component";


@Component({
  selector: 'app-add-main-menu',
  templateUrl: './add-main-menu.component.html',
  styleUrls: ['./add-main-menu.component.scss']
})
export class AddMainMenuComponent implements OnInit {


  primaryMenu: Menu = null;
  public categories: Category[];
  public subCategories: SubCategory[];
  public brands: Brand[];
  priority: number = null;

  // Select Filter
  public filteredCatList: Category[];

  @ViewChild('inputElement') inputElement: any;

  constructor(
    private productService: ProductService,
    private shopService: ShopService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.getCategoryList();
    this.getBrandList();
  }

  /**
   * CONFIRM DIALOG
   */
  public openConfirmDialog() {
    if (this.priority === null) {
      this.uiService.wrong('Priority is required')
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Save',
        message: 'Are you sure you want save this menu?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.addNewMenu();
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
        this.filteredCatList = this.categories.slice();
      }, error => {
        console.log(error);
      });
  }

  private getSubCategoriesByParent(parentCatId: string) {
    this.productService.getSubCatListByParentCatId(parentCatId)
      .subscribe(res => {
        this.subCategories = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getBrandList() {
    this.productService.getAllBrandList()
      .subscribe(res => {
        this.brands = res.data;
      }, error => {
        console.log(error);
      });
  }

  private addNewMenu() {
    this.shopService.addNewMenu(this.primaryMenu)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.primaryMenu = null;
        this.subCategories = [];
        this.priority = null;
      }, error => {
        console.log(error);
      });
  }


  /**
   * SELECTIONS
   */
  onSelectCategory(event: MatSelectChange) {
    this.primaryMenu = {
      _id: null,
      categoryId: event.value._id,
      categoryName: event.value.categoryName,
      slug: event.value.slug,
      subCategories: [],
      priority: this.priority
    };

    this.getSubCategoriesByParent(this.primaryMenu.categoryId);
    // console.log(this.primaryMenu);
  }

  onSelectSubCat(event: MatSelectChange) {
    this.primaryMenu.subCategories = event.value.map(m => {
      return {
        subCatId: m._id,
        subCatName: m.subCatName,
        slug: m.slug,
        brands: []
      };
    });
    // console.log(this.primaryMenu);
  }

  onSelectSubCatBrand(event: MatSelectChange, index: number) {
    this.primaryMenu.subCategories[index].brands = event.value.map(m => {
      return {
        brandId: m._id,
        brandName: m.brandName,
        slug: m.slug
      };
    });
  }

  priorityChangeFn(event: any) {
    if (this.primaryMenu === null) {
      this.primaryMenu = {
        _id: null,
        categoryId: null,
        categoryName: null,
        slug: null,
        subCategories: [],
        priority: event
      };
    } else {
      this.primaryMenu.priority = event;
    }

  }
}

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {MatSelectChange} from '@angular/material/select';
import {Menu} from "../../../../interfaces/menu";
import {Category} from "../../../../interfaces/category";
import {SubCategory} from "../../../../interfaces/sub-category";
import {Brand} from "../../../../interfaces/brand";
import {ProductService} from "../../../../services/product.service";
import {ShopService} from "../../../../services/shop.service";
import {UiService} from "../../../../services/ui.service";
import {ReloadService} from "../../../../services/reload.service";


@Component({
  selector: 'app-update-menu-dialog',
  templateUrl: './update-menu-dialog.component.html',
  styleUrls: ['./update-menu-dialog.component.scss']
})
export class UpdateMenuDialogComponent implements OnInit {

  primaryMenu: Menu = null;
  public categories: Category[];
  public subCategories: SubCategory[];
  public brands: Brand[];
  // Select Filter
  public filteredCatList: Category[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService,
    private shopService: ShopService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    if (this.data.menu !== null) {
      this.primaryMenu = {
        _id: this.data.menu._id,
        categoryId: this.data.menu.categoryId,
        slug: this.data.menu.slug,
        categoryName: this.data.menu.categoryName,
        subCategories: [],
      }
      this.getSubCategoriesByParent(this.data.menu.categoryId);
      this.getBrandList();
    }
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
      subCategories: []
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

  updateMenuItem() {
    this.shopService.updateMenuItem(this.primaryMenu._id, this.primaryMenu.subCategories)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshMenu$();
        this.dialog.closeAll();
      }, error => {
        console.log(error);
      });
  }
}

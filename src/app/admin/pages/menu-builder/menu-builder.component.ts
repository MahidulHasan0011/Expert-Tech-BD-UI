import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {UpdateMenuDialogComponent} from './update-menu-dialog/update-menu-dialog.component';
import {UpdatePriorityDialogComponent} from './update-priority-dialog/update-priority-dialog.component';
import { UpdateSubPriorityDialogComponent } from './update-sub-priority-dialog/update-sub-priority-dialog.component';
import {Menu} from "../../../interfaces/menu";
import {ShopService} from "../../../services/shop.service";
import {UiService} from "../../../services/ui.service";
import {ReloadService} from "../../../services/reload.service";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";

export enum MenuType {
  CATEGORYMENU,
  SUBCATMENY
}

@Component({
  selector: 'app-menu-builder',
  templateUrl: './menu-builder.component.html',
  styleUrls: ['./menu-builder.component.scss']
})


export class MenuBuilderComponent implements OnInit {

  menuList: Menu[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private shopService: ShopService,
    private uiService: UiService,
    private dialog: MatDialog,
    private reloadService: ReloadService,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshMenu$.subscribe(() => {
      this.getAllMenu();
    });

    this.getAllMenu();
  }

  /**
   * CONFIRM DIALOG
   */
  public openConfirmDialog(menuId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this menu?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteMenuById(menuId);
      }
    });
  }

  public openConfirmDialogSubCat(menuId: string, subCatId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this menu?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.onRemoveSubCat(menuId, subCatId);
      }
    });
  }


  /**
   * HTTP REQ HANDLE
   */

  private getAllMenu() {
    this.shopService.getAllMenu()
      .subscribe(res => {
        this.menuList = res.data;
      }, error => {
        console.log(error);
      });
  }

  private deleteMenuById(menuId: string) {
    this.shopService.deleteMenuById(menuId)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshMenu$();
      }, error => {
        console.log(error);
      });
  }


  /**
   * ROUTER LINK
   */
  navigateTo(path: string) {
    this.router.navigate([path], {relativeTo: this.route});
  }

  /**
   * REMOVE SUB AREA
   */

  onRemoveBrand(brandId: string) {
    console.log(brandId)
  }


  private onRemoveSubCat(menuId: string, subCatId: string) {
    this.shopService.deleteMenuSubCat(menuId, subCatId)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshMenu$();
      }, error => {
        console.log(error)
      })
  }

  /**
   * ADD NEW ITEM ON MENU
   */
  public openItemDialog(menu: Menu) {
    this.dialog.open(UpdateMenuDialogComponent, {
      data: {
        menu: menu
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      disableClose: false
    });
  }

  /**
   * ADD NEW ITEM ON MENU
   */
  public openPriorityDialog(menu: Menu) {
    this.dialog.open(UpdatePriorityDialogComponent, {
      data: {
        menu: menu,
        type: MenuType.CATEGORYMENU
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      disableClose: false
    });
  }

  public openPriorityDialogSubCat(subCat: any, cat: any) {
    this.dialog.open(UpdateSubPriorityDialogComponent, {
      data: {
        menu: subCat,
        cat: cat,
        type: MenuType.CATEGORYMENU
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      disableClose: false
    });
  }


}

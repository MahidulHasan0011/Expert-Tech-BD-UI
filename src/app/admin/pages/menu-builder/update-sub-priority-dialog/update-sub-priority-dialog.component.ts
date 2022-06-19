import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import {ProductService} from "../../../../services/product.service";
import {ShopService} from "../../../../services/shop.service";
import {UiService} from "../../../../services/ui.service";
import {ReloadService} from "../../../../services/reload.service";

@Component({
  selector: 'app-update-sub-priority-dialog',
  templateUrl: './update-sub-priority-dialog.component.html',
  styleUrls: ['./update-sub-priority-dialog.component.scss']
})
export class UpdateSubPriorityDialogComponent implements OnInit {

  priority: number = null;

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
    if (this.data.menu.priority !== null) {
      this.priority = this.data.menu.priority;
    }

    console.log(this.data)
  }


  onSubmit(formData: NgForm) {
    if (formData.invalid) {
      this.uiService.warn('Please complete required field');
      return;
    }
    this.updateMenuSubCategoryData(formData.value.priority)
  }

  private updateMenuSubCategoryData(priority: number) {
    console.log(this.data.cat);
    console.log(this.data.menu.subCatId);
    console.log(priority);

    this.shopService.updateMenuSubCategoryData(this.data.cat, this.data.menu.subCatId, priority)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshMenu$();
        this.dialog.closeAll();
      }, error => {
        console.log(error)
      })
  }

}

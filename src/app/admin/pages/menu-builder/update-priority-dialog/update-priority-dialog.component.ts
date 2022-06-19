import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';
import {ProductService} from "../../../../services/product.service";
import {ShopService} from "../../../../services/shop.service";
import {UiService} from "../../../../services/ui.service";
import {ReloadService} from "../../../../services/reload.service";

@Component({
  selector: 'app-update-priority-dialog',
  templateUrl: './update-priority-dialog.component.html',
  styleUrls: ['./update-priority-dialog.component.scss']
})
export class UpdatePriorityDialogComponent implements OnInit {

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
    if (this.data.menu !== null && this.data.menu.priority !== null) {
      this.priority = this.data.menu.priority;
    }

    console.log(this.data)
  }


  onSubmit(formData: NgForm) {
    if (formData.invalid) {
      this.uiService.warn('Please complete required field');
      return;
    }
    this.updateMenuData(formData.value.priority)
  }


  private updateMenuData(priority: number) {
    this.shopService.updateMenuData(this.data.menu._id, {priority})
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshMenu$();
        this.dialog.closeAll();
      }, error => {
        console.log(error)
      })
  }

}

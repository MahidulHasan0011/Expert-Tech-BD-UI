import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {ProductService} from "../../../../../services/product.service";
import {UiService} from "../../../../../services/ui.service";
import {ReloadService} from "../../../../../services/reload.service";
import {ShopService} from "../../../../../services/shop.service";
import {OfferTab} from "../../../../../interfaces/offer-tab";


@Component({
  selector: 'app-publisher-dialog',
  templateUrl: './tab-label-dialog.component.html',
  styleUrls: ['./tab-label-dialog.component.scss']
})
export class TabLabelDialogComponent implements OnInit {

  dataForm: FormGroup;

  isLoading = false;

  label = new FormControl(null, {validators: [Validators.required]});


  constructor(
    public dialogRef: MatDialogRef<TabLabelDialogComponent>,
    private productService: ProductService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private shopService: ShopService,
  ) {
  }

  ngOnInit(): void {

    this.dataForm = new FormGroup({
      label: this.label
    });


  }

  /**
   * ON SUBMIT
   */


  onSubmit() {
    if (this.dataForm.invalid) {
      return;
    }
    const finalData: OfferTab = {
      label: this.dataForm.value.label,
      bannerData: []
    }
    this.addNewOfferLabel(finalData);
  }

  /**
   * HTTP REQ HANDLE
   */
  private addNewOfferLabel(data: OfferTab) {
    this.isLoading = true;
    this.shopService.addNewOfferTab(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshOfferTab$()
        this.isLoading = false;
        this.dialogRef.close();
      }, error => {
        this.isLoading = false;
        console.log(error);
      });
  }

}

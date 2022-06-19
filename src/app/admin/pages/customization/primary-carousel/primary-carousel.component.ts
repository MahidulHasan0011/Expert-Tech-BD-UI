import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

import {forkJoin} from 'rxjs';
import {Carousel} from "../../../../interfaces/carousel";
import {ShopService} from "../../../../services/shop.service";
import {FileUploadService} from "../../../../services/file-upload.service";
import {UiService} from "../../../../services/ui.service";
import {ReloadService} from "../../../../services/reload.service";
import {ConfirmDialogComponent} from "../../../../shared/components/ui/confirm-dialog/confirm-dialog.component";


@Component({
  selector: 'app-primary-carousel',
  templateUrl: './primary-carousel.component.html',
  styleUrls: ['./primary-carousel.component.scss']
})
export class PrimaryCarouselComponent implements OnInit {

  carousels: Carousel[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private shopService: ShopService,
    private fileUploadService: FileUploadService,
    private uiService: UiService,
    private dialog: MatDialog,
    private reloadService: ReloadService,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshCarousel$.subscribe(() => {
      this.getAllCarousel();
    });

    this.getAllCarousel();
  }


  /**
   * CONFIRM DIALOG
   */
  public openConfirmDialog(carousel: Carousel) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this carousel?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteCarouselById(carousel);
      }
    });
  }


  /**
   * HTTP REQ HANDLE
   */

  private getAllCarousel() {
    this.shopService.getAllCarousel()
      .subscribe(res => {
        this.carousels = res.data;
      }, error => {
        console.log(error);
      });
  }

  // private deleteCarouselById(id: string) {
  //   this.shopService.deleteCarouselById(id)
  //     .subscribe(res => {
  //       this.uiService.success(res.message);
  //       this.reloadService.needRefreshCarousel$();
  //     }, error => {
  //       console.log(error);
  //     });
  // }
  productsPerPage: string | number;
  currentPage: string | number;
  totalProducts: string | number;

  /**
   * ROUTER LINK
   */
  navigateTo(path: string) {
    this.router.navigate([path], {relativeTo: this.route});
  }

  /**
   * PARALLEL HTTP REQ HANDLE
   */

  private deleteCarouselById(carousel: Carousel) {
    const productPromise = this.shopService.deleteCarouselById(carousel._id);
    const imagePromise = this.fileUploadService.removeSingleFile({url: carousel.image});

    forkJoin([productPromise, imagePromise]).subscribe(results => {
      this.uiService.success(results[0].message);
      this.reloadService.needRefreshCarousel$();
    });
  }


}

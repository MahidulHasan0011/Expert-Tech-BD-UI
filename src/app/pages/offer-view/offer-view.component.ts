import {Component, OnInit} from '@angular/core';
import {OfferPackage} from '../../interfaces/offer-package';
import {ShopService} from '../../services/shop.service';
import {NgDynamicBreadcrumbService} from 'ng-dynamic-breadcrumb';

@Component({
  selector: 'app-offer-view',
  templateUrl: './offer-view.component.html',
  styleUrls: ['./offer-view.component.scss']
})
export class OfferViewComponent implements OnInit {

  offerPackages: OfferPackage[] = [];

  constructor(
    private shopService: ShopService,
    private ngDynamicBreadcrumbService: NgDynamicBreadcrumbService
  ) {
  }

  ngOnInit(): void {
    this.getAllOfferPackage();
    this.updateBreadcrumb();
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllOfferPackage() {
    this.shopService.getAllOfferPackage()
      .subscribe(res => {
        this.offerPackages = res.data.reverse();
      }, error => {
        console.log(error);
      });
  }

  /**
   * Breadcrumb CUSTOM
   */
  private updateBreadcrumb(): void {
    let breadcrumbs  =  [
      {
        label: 'Home',
        url: '/'
      },
      {
        label: 'Offers',
        url: ''
      }
    ];
    this.ngDynamicBreadcrumbService.updateBreadcrumb(breadcrumbs);
  }

}

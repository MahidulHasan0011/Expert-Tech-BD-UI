import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ShopService} from '../../../services/shop.service';
import {OfferPackage} from '../../../interfaces/offer-package';
import {NgDynamicBreadcrumbService} from 'ng-dynamic-breadcrumb';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.scss']
})
export class OfferDetailsComponent implements OnInit {
  offerPackageId: string = null;
  offerPackage: OfferPackage = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private shopService: ShopService,
    private ngDynamicBreadcrumbService: NgDynamicBreadcrumbService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(param => {
      this.offerPackageId = param.get('id');
      this.getAllOfferPackage();
    })
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllOfferPackage() {
    this.shopService.getQueryOfferPackage(this.offerPackageId)
      .subscribe(res => {
        this.offerPackage = res.data;
        this.updateBreadcrumb();
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
        url: '/information/offers'
      },
      {
        label: this.offerPackage.title,
        url: ''
      }
    ];
    this.ngDynamicBreadcrumbService.updateBreadcrumb(breadcrumbs);
  }

}

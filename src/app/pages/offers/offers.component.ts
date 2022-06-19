import { Component, OnInit } from '@angular/core';
import {PromotionalOffer} from "../../interfaces/promotional-offer";
import {PromotionalOfferProduct} from "../../interfaces/promotional-offer-product";
import {ActivatedRoute} from "@angular/router";
import {PromotionalOfferService} from "../../services/promotional-offer.service";
import {NgxSpinnerService} from "ngx-spinner";
import {PromotionalOfferProductService} from "../../services/promotional-offer-product.service";
import {Product} from "../../interfaces/product";
import {CampaignStatusEnum} from "../../enum/campaign-status";
import {UtilsService} from "../../services/utils.service";
import { OfferCategoryCard } from '../../interfaces/offer-category-card';
import { OfferCategoryCardService } from '../../services/offer-category-card.service';
import { ReloadService } from '../../services/reload.service';


@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {

  PromoOfferSlug: string = null;
  allOfferCategoryCard: OfferCategoryCard[] = [];
  offerProducts: PromotionalOfferProduct[] = [];
  promotionalOffer: PromotionalOffer;
  campaignStatus: CampaignStatusEnum;

  isCampaignRunning: boolean;
  isCampaignStart: boolean;
  isCampaignEnd: boolean;
  products: Product[] = [];
  startDateTimeData: any;
  endDateTimeData: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private promotionalOfferProductService: PromotionalOfferProductService,
    private promotionalOfferService: PromotionalOfferService,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    private offerCategoryCardService: OfferCategoryCardService,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(param => {
      this.PromoOfferSlug = param.get('slug');
      this.getOfferProductBySlug();
    });
    this.reloadService.refreshPromotionalOffer$.subscribe(() => {
      this.getAllOfferCategoryCard();
    });
    this.getAllOfferCategoryCard();
  }

  /**
   * HTTP REQ
   */
  private getAllOfferCategoryCard() {
    this.offerCategoryCardService.getAllOfferCategoryCard().subscribe(
      (res) => {
        this.allOfferCategoryCard = res.data;
        console.log(res.data);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  private getOfferProductBySlug() {
    this.spinner.show();
    const selectProductField = '-attributes -filterData -tags -ratingReview -discussion -warrantyServices';
    this.promotionalOfferProductService.getPromotionalOfferProductBySlugMulti(this.PromoOfferSlug, selectProductField)
      .subscribe(res => {
        this.spinner.hide();
        if (res.info) {
          this.promotionalOffer = res.info;
        }
        if (res.data) {
          this.offerProducts = res.data;
        }
        this.campaignStatus = res.campaignStatus;
        this.startDateTimeData = this.utilsService.convertToDateTime(this.promotionalOffer.campaignStartDate, this.promotionalOffer.campaignStartTime)
        this.endDateTimeData = this.utilsService.convertToDateTime(this.promotionalOffer.campaignEndDate, this.promotionalOffer.campaignEndTime)
        console.log(res);
        // this.isCampaignRunning = res.isCampaignRunning;
        // this.offerProducts = res.data;
        // this.promotionalOffer = this.offerProducts ? (this.offerProducts.promotionalOffer as PromotionalOffer) : null;
        // if (this.isCampaignRunning) {
        //   this.products = this.offerProducts.products as Product[];
        // }


        // this.isCampaignStart = res.isCampaignStart;
        // this.isCampaignEnd = res.isCampaignEnd;
        // this.endDateTimeData = res.endDateTimeData;
        // this.startDateTimeData = res.startDateTimeData;
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private getSinglePromotionalOfferById() {
    this.promotionalOfferService.getSinglePromotionalOfferBySlug(this.PromoOfferSlug)
      .subscribe(res => {
        this.promotionalOffer = res.data;
      }, error => {
        console.log(error);
      });
  }

}

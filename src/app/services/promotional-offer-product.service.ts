import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Pagination} from '../interfaces/pagination';
import {PromotionalOfferProduct} from '../interfaces/promotional-offer-product';
import {PromotionalOffer} from "../interfaces/promotional-offer";
import {CampaignStatusEnum} from "../enum/campaign-status";

const API_PROMOTIONAL_OFFER_PRODUCT = environment.apiBaseLink + '/api/promotional-offer-product/';

@Injectable({
  providedIn: 'root'
})
export class PromotionalOfferProductService {

  constructor(
    private http: HttpClient,
  ) {
  }

  /**
   * Image Folder
   */

  addNewPromotionalOfferProduct(data: PromotionalOfferProduct) {
    return this.http.post<{ message: string }>(API_PROMOTIONAL_OFFER_PRODUCT + 'add-new-promotional-offer-product', data);
  }


  getAllPromotionalOfferProduct(pagination?: Pagination) {
    if (pagination) {
      let params = new HttpParams();
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      return this.http.get<{ data: PromotionalOfferProduct[], count: number, message?: string }>
      (API_PROMOTIONAL_OFFER_PRODUCT + 'get-all-promotional-offer-product-list', {params});
    } else {
      return this.http.get<{ data: PromotionalOfferProduct[], count: number, message?: string }>
      (API_PROMOTIONAL_OFFER_PRODUCT + 'get-all-promotional-offer-product-list');
    }
  }

  getSinglePromotionalOfferProductById(id: string, selectProductField?: string) {
    let params = new HttpParams();
    if (selectProductField) {
      params = params.append('select', selectProductField);
    }
    // tslint:disable-next-line:max-line-length
    return this.http.get<{ data: PromotionalOfferProduct, message?: string }>(API_PROMOTIONAL_OFFER_PRODUCT + 'get-promotional-offer-product-by-id/' + id, {params});
  }

  getPromotionalOfferProductBySlug(slug: string,  selectProductField?: string) {
    let params = new HttpParams();
    if (selectProductField) {
      params = params.append('select', selectProductField);
    }
    return this.http.get<{ data: PromotionalOfferProduct, message: string, isCampaignRunning: boolean, isCampaignStart: boolean, isCampaignEnd: boolean, startDateTimeData: any, endDateTimeData: any }>(API_PROMOTIONAL_OFFER_PRODUCT + 'get-promotional-offer-product-by-slug-multiple/' + slug, {params});
  }

  getPromotionalOfferProductBySlugMulti(slug: string,  selectProductField?: string) {
    let params = new HttpParams();
    if (selectProductField) {
      params = params.append('select', selectProductField);
    }
    return this.http.get<{ data: PromotionalOfferProduct[], info: PromotionalOffer, campaignStatus: CampaignStatusEnum}>(API_PROMOTIONAL_OFFER_PRODUCT + 'get-promotional-offer-product-by-slug-multiple/' + slug, {params});
  }


  editPromotionalOfferProduct(data: PromotionalOfferProduct) {
    return this.http.put<{ message: string }>(API_PROMOTIONAL_OFFER_PRODUCT + 'edit-promotional-offer-product-by-id', data);
  }

  deletePromotionalOfferProductById(id: string) {
    return this.http.delete<{ message: string }>(API_PROMOTIONAL_OFFER_PRODUCT + 'delete-promotional-offer-product-by-id/' + id);
  }


}

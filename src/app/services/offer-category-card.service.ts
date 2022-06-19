import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Pagination } from '../interfaces/pagination';
import { OfferCategoryCard } from '../interfaces/offer-category-card';
import { PromotionalOffer } from '../interfaces/promotional-offer';
import { CampaignStatusEnum } from '../enum/campaign-status';

const API_OFFER_CATEGORY_CARD =
  environment.apiBaseLink + '/api/offer-category-card/';

@Injectable({
  providedIn: 'root',
})
export class OfferCategoryCardService {
  constructor(private http: HttpClient) {}

  /**
   * Image Folder
   */

  addNewOfferCategoryCard(data: OfferCategoryCard) {
    return this.http.post<{ message: string }>(
      API_OFFER_CATEGORY_CARD + 'add-new-offer-category-card',
      data
    );
  }

  getAllOfferCategoryCard(pagination?: Pagination) {
    if (pagination) {
      let params = new HttpParams();
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      return this.http.get<{
        data: OfferCategoryCard[];
        count: number;
        message?: string;
      }>(API_OFFER_CATEGORY_CARD + 'get-all-offer-category-card-list', {
        params,
      });
    } else {
      return this.http.get<{
        data: OfferCategoryCard[];
        count: number;
        message?: string;
      }>(API_OFFER_CATEGORY_CARD + 'get-all-offer-category-card-list');
    }
  }

  getSingleOfferCategoryCardById(id: string, selectProductField?: string) {
    let params = new HttpParams();
    if (selectProductField) {
      params = params.append('select', selectProductField);
    }
    // tslint:disable-next-line:max-line-length
    return this.http.get<{ data: OfferCategoryCard; message?: string }>(
      API_OFFER_CATEGORY_CARD + 'get-offer-category-card-by-id/' + id,
      { params }
    );
  }

  getOfferCategoryCardBySlug(slug: string, selectProductField?: string) {
    let params = new HttpParams();
    if (selectProductField) {
      params = params.append('select', selectProductField);
    }
    return this.http.get<{
      data: OfferCategoryCard;
      message: string;
      isCampaignRunning: boolean;
      isCampaignStart: boolean;
      isCampaignEnd: boolean;
      startDateTimeData: any;
      endDateTimeData: any;
    }>(
      API_OFFER_CATEGORY_CARD +
        'get-offer-category-card-by-slug-multiple/' +
        slug,
      { params }
    );
  }

  getOfferCategoryCardBySlugMulti(slug: string, selectProductField?: string) {
    let params = new HttpParams();
    if (selectProductField) {
      params = params.append('select', selectProductField);
    }
    return this.http.get<{
      data: OfferCategoryCard[];
      info: PromotionalOffer;
      campaignStatus: CampaignStatusEnum;
    }>(
      API_OFFER_CATEGORY_CARD +
        'get-offer-category-card-by-slug-multiple/' +
        slug,
      { params }
    );
  }

  editOfferCategoryCardProduct(data: OfferCategoryCard) {
    return this.http.put<{ message: string }>(
      API_OFFER_CATEGORY_CARD + 'edit-offer-category-card-by-id',
      data
    );
  }

  deleteOfferCategoryCardById(id: string) {
    return this.http.delete<{ message: string }>(
      API_OFFER_CATEGORY_CARD + 'delete-offer-category-card-by-id/' + id
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Menu } from '../interfaces/menu';
import { Carousel } from '../interfaces/carousel';
import { OfferTab } from '../interfaces/offer-tab';
import { TabData } from '../interfaces/tab-data';
import { ContactInfo } from '../interfaces/contact-info';
import { OfferProduct } from '../interfaces/offer-product';
import { OfferPackage } from '../interfaces/offer-package';
import { OfferBannerCard } from '../interfaces/offer-banner-card';
import { MenuChild } from '../interfaces/menu-child';
import { OfferBanner } from '../interfaces/offer-banner';
import { PageInfo } from '../interfaces/page-info';
import { Branch } from '../interfaces/branch';
import { Pagination } from '../interfaces/pagination';

const API_URL_MENU = environment.apiBaseLink + '/api/menu/';
const API_URL_SHOP = environment.apiBaseLink + '/api/shop/';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  constructor(private http: HttpClient) {}

  /**
   * PRIMARY MENU
   */
  addNewMenu(data: Menu) {
    return this.http.post<{ message: string }>(
      API_URL_MENU + 'add-new-menu',
      data
    );
  }

  updateMenuItem(menuId: string, data: MenuChild[]) {
    return this.http.post<{ message: string }>(
      API_URL_MENU + 'update-menu-item',
      { id: menuId, data }
    );
  }

  getAllMenu() {
    return this.http.get<{ data: Menu[] }>(API_URL_MENU + 'get-all-menu');
  }

  deleteMenuById(menuId: string) {
    return this.http.delete<{ message: string }>(
      API_URL_MENU + 'delete-menu-by-id/' + menuId
    );
  }

  deleteMenuSubCat(menuId: string, subCatId: string) {
    return this.http.post<{ message: string }>(
      API_URL_MENU + 'delete-menu-sub-item',
      { id: menuId, subCatId }
    );
  }

  updateMenuData(menuId: string, update: object) {
    return this.http.post<{ message: string }>(
      API_URL_MENU + 'update-menu-data',
      { id: menuId, data: update }
    );
  }

  updateMenuSubCategoryData(
    menuId: string,
    subCatId: string,
    priority: number
  ) {
    return this.http.post<{ message: string }>(
      API_URL_MENU + 'update-menu-sub-priority-data',
      { id: menuId, subCatId, priority }
    );
  }

  /**
   * CAROUSEL
   */
  addNewCarousel(data: Carousel) {
    return this.http.post<{ message: string }>(
      API_URL_SHOP + 'add-new-carousel',
      data
    );
  }

  editCarousel(data: Carousel) {
    return this.http.put<{ message: string }>(
      API_URL_SHOP + 'edit-Carousel-by-id',
      data
    );
  }

  getAllCarousel(select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.http.get<{ data: Carousel[] }>(
      API_URL_SHOP + 'get-all-carousel',
      { params }
    );
  }

  getSingleCarouselById(id: string, selectProductField?: string) {
    let params = new HttpParams();
    if (selectProductField) {
      params = params.append('select', selectProductField);
    }
    // tslint:disable-next-line:max-line-length
    return this.http.get<{ data: Carousel; message?: string }>(
      API_URL_SHOP + 'get-carousel-by-id/' + id,
      { params }
    );
  }

  deleteCarouselById(id: string) {
    return this.http.delete<{ message: string }>(
      API_URL_SHOP + 'delete-carousel-by-id/' + id
    );
  }

  /**
   * Offer Banner Card
   */
  addOfferBannerCard(data: OfferBannerCard) {
    return this.http.post<{ message: string }>(
      API_URL_SHOP + 'add-new-offer-banner-card',
      data
    );
  }

  getAllOfferBannerCard(pagination?: Pagination, select?: string) {
    let params = new HttpParams();
    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
    }
    if (select) {
      params = params.append('select', select);
    }
    return this.http.get<{ data: OfferBannerCard[]; count: number }>(
      API_URL_SHOP + 'get-all-offer-banner-card',
      { params }
    );
  }

  deleteOfferBannerCardById(id: string) {
    return this.http.delete<{ message: string }>(
      API_URL_SHOP + 'delete-offer-banner-card/' + id
    );
  }

  /**
   * Offer Banner
   */

  addNewOfferTab(data: OfferTab) {
    return this.http.post<{ message: string }>(
      API_URL_SHOP + 'add-new-offer-banner',
      data
    );
  }

  createNewOfferBanner(data: OfferBanner) {
    return this.http.post<{ message: string }>(
      API_URL_SHOP + 'add-new-offer-banner',
      data
    );
  }

  getAllOfferBanner(select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.http.get<{ data: OfferTab[] }>(
      API_URL_SHOP + 'get-all-offer-banner',
      { params }
    );
  }

  pushOfferData(tabId: string, data: TabData) {
    return this.http.post<{ message: string }>(
      API_URL_SHOP + 'push-offer-banner-data',
      { id: tabId, data: data }
    );
  }

  removeOfferData(bannerId: string, offerId: string) {
    return this.http.post<{ message: string }>(
      API_URL_SHOP + 'pull-offer-banner-data',
      { bannerId: bannerId, offerId: offerId }
    );
  }

  addNewOfferBanner(data: OfferTab) {
    return this.http.post<{ message: string }>(
      API_URL_SHOP + 'add-new-offer-banner',
      data
    );
  }

  deleteOfferBannerTabById(id: string) {
    return this.http.delete<{ message: string }>(
      API_URL_SHOP + 'delete-offer-banner-by-id/' + id
    );
  }

  /**
   * Contact Info
   */

  setContactInfo(data: ContactInfo) {
    return this.http.post<{ message: string }>(
      API_URL_SHOP + 'set-contact-info',
      data
    );
  }

  getContactInfo(select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.http.get<{ data: ContactInfo }>(
      API_URL_SHOP + 'get-contact-info',
      { params }
    );
  }

  /**
   * Branch Info
   */

  setBranchInfo(data: Branch) {
    return this.http.post<{ message: string }>(
      API_URL_SHOP + 'set-branch-info',
      data
    );
  }

  getBranchInfo() {
    return this.http.get<{ data: Branch[] }>(API_URL_SHOP + 'get-branch-info');
  }

  deleteBranchInfoById(id: string) {
    return this.http.delete<{ message: string }>(
      API_URL_SHOP + 'delete-branch-info-by-id/' + id
    );
  }

  /**
   * OFFER PRODUCT
   */
  addOfferProduct(data: OfferProduct) {
    return this.http.post<{ message: string }>(
      API_URL_SHOP + 'add-new-offer-product',
      data
    );
  }

  getAllOfferProduct() {
    return this.http.get<{ data: OfferProduct[] }>(
      API_URL_SHOP + 'get-all-offer-product'
    );
  }

  getQueryOfferProduct(tagSlug: string) {
    return this.http.get<{ data: OfferProduct[] }>(
      API_URL_SHOP + 'get-query-offer-product/' + tagSlug
    );
  }

  deleteOfferProductById(id: string) {
    return this.http.delete<{ message: string }>(
      API_URL_SHOP + 'delete-offer-product/' + id
    );
  }

  /**
   * OFFER PACKAGE
   */
  addOfferPackage(data: OfferPackage) {
    return this.http.post<{ message: string }>(
      API_URL_SHOP + 'add-new-offer-package',
      data
    );
  }

  getAllOfferPackage() {
    return this.http.get<{ data: OfferPackage[] }>(
      API_URL_SHOP + 'get-all-offer-package'
    );
  }

  getQueryOfferPackage(id: string) {
    return this.http.get<{ data: OfferPackage }>(
      API_URL_SHOP + 'get-query-offer-package/' + id
    );
  }

  deleteOfferPackageById(id: string) {
    return this.http.delete<{ message: string }>(
      API_URL_SHOP + 'delete-offer-package/' + id
    );
  }

  /**
   * PAGE INFO
   */
  addPageInfo(data: PageInfo) {
    return this.http.post<{ message: string }>(
      API_URL_SHOP + 'add-page-info',
      data
    );
  }

  getPageInfoBySlug(slug: string) {
    return this.http.get<{ data: PageInfo }>(
      API_URL_SHOP + 'get-page-info/' + slug
    );
  }
}

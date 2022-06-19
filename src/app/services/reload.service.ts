import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReloadService {
  private refreshCategory = new Subject<void>();
  private refreshPublisher = new Subject<void>();
  private refreshAuthor = new Subject<void>();
  private refreshFeaturedCategory = new Subject<void>();
  private refreshBook = new Subject<void>();
  private refreshLocal = new Subject<void>();
  private refreshCart = new Subject<void>();
  private refreshMenu = new Subject<void>();
  private refreshCarousel = new Subject<void>();
  private refreshOfferTab = new Subject<void>();
  private refreshContactInfo = new Subject<void>();
  private refreshPcBuild = new Subject<void>();
  private refreshCompareList = new Subject<void>();
  private refreshOfferProduct = new Subject<void>();
  private refreshProduct = new Subject<void>();
  private refreshOfferBannerCard = new Subject<void>();
  private refreshUser = new Subject<void>();
  private refreshAddress = new Subject<void>();
  private refreshHomeCatBooks = new Subject<void>();
  private refreshOrder = new Subject<void>();
  private refreshReview = new Subject<void>();
  private refreshWishlist = new Subject<void>();
  private refreshCoupon = new Subject<void>();
  private refreshAdmin = new Subject<void>();
  private refreshBranch = new Subject<void>();
  private refreshLocalCart = new Subject<void>();
  private refreshReviewControl = new Subject<void>();
  private refreshRoles = new Subject<void>();
  private refreshData = new Subject<void>();
  private refreshGallery = new Subject<void>();
  private refreshImageFolder = new Subject<void>();
  private refreshFeaturedProduct = new Subject<void>();
  private refreshPromotionalOffer = new Subject<void>();
  private refreshPromotionalOfferProduct = new Subject<void>();

  /**
   * PromotionalOffer
   */
  get refreshPromotionalOffer$() {
    return this.refreshPromotionalOffer;
  }
  needRefreshPromotionalOffer$() {
    this.refreshPromotionalOffer.next();
  }
  /**
   * PromotionalOfferProduct
   */
  get refreshPromotionalOfferProduct$() {
    return this.refreshPromotionalOfferProduct;
  }
  needRefreshPromotionalOfferProduct$() {
    this.refreshPromotionalOfferProduct.next();
  }

  /**
   * refreshGallery
   */

  get refreshGallery$() {
    return this.refreshGallery;
  }

  needRefreshGallery$() {
    this.refreshGallery.next();
  }
  /**
   * ImageFolder
   */
  get refreshImageFolder$() {
    return this.refreshImageFolder;
  }

  needRefreshImageFolder$() {
    this.refreshImageFolder.next();
  }
  /**
   * FeaturedProduct
   */
  get refreshFeaturedProduct$() {
    return this.refreshFeaturedProduct;
  }

  needRefreshFeaturedProduct$() {
    this.refreshFeaturedProduct.next();
  }

  get refreshData$() {
    return this.refreshData;
  }
  needRefreshData$() {
    this.refreshData.next();
  }

  get refreshRoles$() {
    return this.refreshRoles;
  }
  needRefreshRoles$() {
    this.refreshRoles.next();
  }

  /**
   * ReviewControl
   */
  get refreshReviewControl$() {
    return this.refreshReviewControl;
  }

  needRefreshReviewControl$() {
    this.refreshReviewControl.next();
  }

  /**
   * BANNER
   */
  get refreshLocalCart$() {
    return this.refreshLocalCart;
  }

  needRefreshLocalCart$() {
    this.refreshLocalCart.next();
  }

  /**
   * refreshBranch
   */

  get refreshBranch$() {
    return this.refreshBranch;
  }

  needRefreshBranch$() {
    this.refreshBranch.next();
  }

  /**
   * refreshAdmin
   */

  get refreshAdmin$() {
    return this.refreshAdmin;
  }

  needRefreshAdmin$() {
    this.refreshAdmin.next();
  }

  /**
   * refreshCoupon
   */

  get refreshCoupon$() {
    return this.refreshCoupon;
  }

  needRefreshCoupon$() {
    this.refreshCoupon.next();
  }

  /**
   * refreshWishlist
   */

  get refreshWishlist$() {
    return this.refreshWishlist;
  }

  needRefreshWishlist$() {
    this.refreshWishlist.next();
  }

  /**
   * refreshCoupon
   */

  get refreshReview$() {
    return this.refreshReview;
  }

  needRefreshReview$() {
    this.refreshReview.next();
  }

  /**
   * refreshCoupon
   */

  get refreshOrder$() {
    return this.refreshOrder;
  }

  needRefreshOrder$() {
    this.refreshOrder.next();
  }

  /**
   * refreshAddress
   */

  get refreshHomeCatBooks$() {
    return this.refreshHomeCatBooks;
  }

  needRefreshHomeCatBooks$() {
    this.refreshHomeCatBooks.next();
  }

  /**
   * refreshAddress
   */

  get refreshAddress$() {
    return this.refreshAddress;
  }

  needRefreshAddress$() {
    this.refreshAddress.next();
  }

  /**
   * refreshUser
   */

  get refreshUser$() {
    return this.refreshUser;
  }

  needRefreshUser$() {
    this.refreshUser.next();
  }

  /**
   * CATEGORY AREA
   */

  get refreshCategory$() {
    return this.refreshCategory;
  }

  needRefreshCat$() {
    this.refreshCategory.next();
  }

  /**
   * PUBLISHER AREA
   */
  get refreshPublisher$() {
    return this.refreshPublisher;
  }

  needRefreshPublisher$() {
    this.refreshPublisher.next();
  }

  /**
   * AUTHOR AREA
   */
  get refreshAuthor$() {
    return this.refreshAuthor;
  }

  needRefreshAuthor$() {
    this.refreshAuthor.next();
  }

  /**
   *  FEATURED CATEGORY
   **/
  get refreshFeaturedCategory$() {
    return this.refreshFeaturedCategory;
  }

  needRefreshFeaturedCategory$() {
    this.refreshFeaturedCategory.next();
  }

  /**
   * BOOK AREA
   */
  get refreshBook$() {
    return this.refreshBook;
  }

  needRefreshBook$() {
    this.refreshBook.next();
  }

  /**
   * LOCAL DB
   */
  get refreshLocal$() {
    return this.refreshLocal;
  }

  needRefreshLocal$() {
    this.refreshLocal.next();
  }

  /**
   * CART
   */
  get refreshCart$() {
    return this.refreshCart;
  }

  needRefreshCart$() {
    this.refreshCart.next();
  }

  /**
   * Menu
   */
  get refreshMenu$() {
    return this.refreshMenu;
  }

  needRefreshMenu$() {
    this.refreshMenu.next();
  }

  /**
   * Carousel
   */
  get refreshCarousel$() {
    return this.refreshCarousel;
  }

  needRefreshCarousel$() {
    this.refreshCarousel.next();
  }

  /**
   * refreshOfferBannerCard
   */
  get refreshOfferBannerCard$() {
    return this.refreshOfferBannerCard;
  }

  needRefreshOfferBannerCard$() {
    this.refreshOfferBannerCard.next();
  }

  /**
   * Carousel
   */
  get refreshOfferTab$() {
    return this.refreshOfferTab;
  }

  needRefreshOfferTab$() {
    this.refreshOfferTab.next();
  }

  /**
   * Carousel
   */
  get refreshContactInfo$() {
    return this.refreshContactInfo;
  }

  needRefreshContactInfo$() {
    this.refreshContactInfo.next();
  }

  /**
   * Carousel
   */
  get refreshPcBuild$() {
    return this.refreshPcBuild;
  }

  needRefreshPcBuild$() {
    this.refreshPcBuild.next();
  }

  /**
   * CompareList
   */
  get refreshCompareList$() {
    return this.refreshCompareList;
  }

  needRefreshCompareList$() {
    this.refreshCompareList.next();
  }

  /**
   * CompareList
   */
  get refreshOfferProduct$() {
    return this.refreshOfferProduct;
  }

  needRefreshOfferProduct$() {
    this.refreshOfferProduct.next();
  }

  /**
   * CompareList
   */
  get refreshProduct$() {
    return this.refreshProduct;
  }

  needRefreshProduct$() {
    this.refreshProduct.next();
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Category } from '../interfaces/category';
import { SubCategory } from '../interfaces/sub-category';
import { Brand } from '../interfaces/brand';
import { FeaturedCategory } from '../interfaces/featured-category';
import { Book } from '../interfaces/book';
import { ImageFormat, Product } from '../interfaces/product';
import { SearchCollection } from '../interfaces/search-collection';
import { Pagination } from '../interfaces/pagination';

const API_CATEGORY = environment.apiBaseLink + '/api/category/';
const API_SUB_CAT = environment.apiBaseLink + '/api/sub-category/';
const API_BRAND = environment.apiBaseLink + '/api/brand/';
const API_FEATURED_CAT = environment.apiBaseLink + '/api/featured-category/';
const API_BOOK = environment.apiBaseLink + '/api/book/';
const API_PRODUCT = environment.apiBaseLink + '/api/product/';
const API_TEST = environment.apiBaseLink + '/api/test/';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  /**
   * CATEGORY
   */
  addNewCategory(data: Category) {
    return this.http.post<{ message: string }>(
      API_CATEGORY + 'add-new-category',
      data
    );
  }

  getAllCategoryList() {
    return this.http.get<{ data: Category[]; message: string }>(
      API_CATEGORY + 'get-all-category-list'
    );
  }

  getCategoryBasicList() {
    return this.http.get<{ data: Category[] }>(
      API_CATEGORY + 'get-category-basic-list'
    );
  }

  editCategory(data: Category) {
    return this.http.post<{ message: string }>(
      API_CATEGORY + 'edit-category-by-id',
      data
    );
  }

  deleteCategory(id: string) {
    return this.http.delete<{ message: string }>(
      API_CATEGORY + 'delete-category-by-id/' + id
    );
  }

  /**
   * Sub Category
   */
  addNewSubCategory(data: any) {
    return this.http.post<{ message: string }>(
      API_SUB_CAT + 'add-new-sub-category',
      data
    );
  }

  getAllSubCategoryList() {
    return this.http.get<{ data: SubCategory[]; message: string }>(
      API_SUB_CAT + 'get-all-sub-category-list'
    );
  }

  getSubCatListByParentCatId(parentCatId: string) {
    return this.http.get<{ data: SubCategory[]; message: string }>(
      API_SUB_CAT + 'get-sub-category-by-parent-cat/' + parentCatId
    );
  }

  getSubCatsByParentSlug(slug: string) {
    return this.http.get<{ data: SubCategory[] }>(
      API_SUB_CAT + 'get-sub-category-by-parent-slug/' + slug
    );
  }

  editSubCategory(data: SubCategory) {
    return this.http.put<{ message: string }>(
      API_SUB_CAT + 'edit-sub-category-by-id',
      data
    );
  }

  deleteSubCategory(id: string) {
    return this.http.delete<{ message: string }>(
      API_SUB_CAT + 'delete-sub-category-by-id/' + id
    );
  }

  getASingleSubCategoryById(id: string) {
    return this.http.get<{ data: SubCategory }>(
      API_SUB_CAT + 'get-sub-category-details-by-id/' + id
    );
  }

  /**
   * Author
   */
  addNewBrand(data: Brand) {
    return this.http.post<{ message: string }>(
      API_BRAND + 'add-new-brand',
      data
    );
  }

  getAllBrandList() {
    return this.http.get<{ data: any[]; message: string }>(
      API_BRAND + 'get-all-brand-list'
    );
  }

  editBrand(data: Brand) {
    return this.http.post<{ message: string }>(
      API_BRAND + 'edit-brand-by-id',
      data
    );
  }

  deleteBrand(id: string) {
    return this.http.delete<{ message: string }>(
      API_BRAND + 'delete-brand-by-id/' + id
    );
  }

  /**
   * Featured Category
   */
  addNewFeaturedCategory(data: FeaturedCategory) {
    return this.http.post<{ message: string }>(
      API_FEATURED_CAT + 'add-new-featured-category',
      data
    );
  }

  getAllFeaturedCategoryList() {
    return this.http.get<{ data: any[]; message: string }>(
      API_FEATURED_CAT + 'get-all-featured-category-list'
    );
  }

  editFeaturedCategory(data: FeaturedCategory) {
    return this.http.post<{ message: string }>(
      API_FEATURED_CAT + 'edit-featured-category-by-id',
      data
    );
  }

  deleteFeaturedCategory(id: string) {
    return this.http.delete<{ message: string }>(
      API_FEATURED_CAT + 'delete-featured-category-by-id/' + id
    );
  }

  /**
   * Product
   * Filter Product
   */
  addNewProduct(data: Product) {
    return this.http.post<{ message: string }>(
      API_PRODUCT + 'add-single-product',
      data
    );
  }

  getAllProductList() {
    return this.http.get<{ data: Product[]; message: string }>(
      API_PRODUCT + 'get-all-product-list'
    );
  }

  getBookById(id: string) {
    return this.http.get<{ data: Book; message: string }>(
      API_BOOK + 'get-single-book-by-id/' + id
    );
  }

  getProductBySlug(slug: string) {
    return this.http.get<{ data: Product; message: string }>(
      API_PRODUCT + 'get-single-product-by-slug/' + slug
    );
  }

  getSingleProductById(id: string) {
    return this.http.get<{ data: Product; message: string }>(
      API_PRODUCT + 'get-single-product-by-id/' + id
    );
  }

  editBook(data: Book) {
    return this.http.post<{ message: string }>(
      API_BOOK + 'edit-book-by-id',
      data
    );
  }

  deleteProduct(id: string) {
    return this.http.delete<{ message: string }>(
      API_PRODUCT + 'delete-product-by-id/' + id
    );
  }

  // getSearchProduct(searchTerm: string, productPerPage?: string, currentPage?: string) {
  //   let params = new HttpParams();
  //   params = params.append('q', searchTerm);
  //   params = params.append('pageSize', productPerPage);
  //   params = params.append('page', currentPage);
  //   return this.http.get<{ data: Product[], count: number }>(API_PRODUCT + 'get-products-by-text-search', {params});
  // }

  /**
   * GLOBAL SEARCH
   */

  getFromCollectionBySearch(
    searchCollection: SearchCollection,
    pagination?: Pagination
  ) {
    let params = new HttpParams();
    params = params.set('collectionName', searchCollection.collectionName);
    params = params.set('q', searchCollection.query);
    if (searchCollection.searchField1) {
      params = params.set('searchField1', searchCollection.searchField1);
    }
    if (searchCollection.searchField2) {
      params = params.set('searchField2', searchCollection.searchField2);
    }

    if (pagination) {
      return this.http.post<{ data: any[]; count: number }>(
        API_PRODUCT + 'get-from-collection-by-search?' + params.toString(),
        { paginate: pagination }
      );
    } else {
      return this.http.post<{ data: any[]; count: number }>(
        API_PRODUCT + 'get-from-collection-by-search?' + params.toString(),
        null
      );
    }
  }

  getProductsByQuery(
    query: any,
    pagination?: { pageSize: number; currentPage: number },
    sort?: any,
    select?: any
  ) {
    return this.http.post<{ data: Product[]; count: number }>(
      API_PRODUCT + 'get-products-by-query',
      { query, pagination, sort, select }
    );
  }

  productFilterByMenu(query: object, paginate?: object) {
    const data = { query, paginate };
    return this.http.post<{ data: Product[]; count: number }>(
      API_PRODUCT + 'product-filter-by-menu-navigate',
      data
    );
  }

  productFilterByQuery(query: object, paginate?: object) {
    const data = { query, paginate };
    return this.http.post<{ data: Product[]; count: number }>(
      API_PRODUCT + 'product-filter-query',
      data
    );
  }

  // getSpecificBooksById(ids: string[]) {
  //   return this.http.post<{ data: Product[]}>(API_PRODUCT + 'get-specific-books-by-id', {bookId: ids});
  // }

  getSpecificBooksById(ids: string[]) {
    console.log(ids);
    return this.http.post<{ data: Product[] }>(
      API_PRODUCT + 'get-specific-books-by-id',
      { bookId: ids }
    );
  }

  /**
   * TEST
   */

  addNewTestProduct(data: any) {
    return this.http.post<{ message: string }>(
      API_TEST + 'add-test-product',
      data
    );
  }

  filterTestProduct(data: any) {
    return this.http.post<{ data: any[] }>(
      API_TEST + 'filter-test-product',
      data
    );
  }

  insertFilterCategory(data: any) {
    return this.http.post<{ message: string }>(
      API_TEST + 'insert-filter-category',
      data
    );
  }

  getFilterCategory() {
    return this.http.get<{ data: any }>(API_TEST + 'get-filter-category');
  }

  /**
   * COMPARE LIST with LOCAL STORAGE
   */

  addToCompare(product: Product) {
    // console.log(product);
    const items = JSON.parse(localStorage.getItem('compareList'));

    let compareList;

    if (items === null) {
      compareList = [];
      compareList.push(product);
      // this.uiService.success('Product added to compare list');
    } else {
      compareList = items;
      const fIndex = compareList.findIndex((o) => o._id === product._id);
      if (fIndex === -1) {
        if (compareList.length !== 3) {
          compareList.push(product);
          // this.uiService.success('Product added to compare list');
        } else {
          // this.uiService.wrong('Your compare list is full');
        }
      } else {
        // this.uiService.warn('This product already in compare list');
      }
    }
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }

  getCompareList(): string[] {
    const list = localStorage.getItem('compareList');
    if (list === null) {
      return [];
    }
    return JSON.parse(list) as string[];
  }

  deleteCompareItem(id: string) {
    const items = JSON.parse(localStorage.getItem('compareList'));
    const filtered = items.filter((el) => el._id !== id);
    localStorage.setItem('compareList', JSON.stringify(filtered));
  }

  /**
   * CATEGORY FILTER
   */
  getCategoryFilter(slug: string) {
    return this.http.get<{ data: any }>(
      API_CATEGORY + 'get-category-filter/' + slug
    );
  }

  filterByCatFilters(data: any) {
    return this.http.post<{ data: Product[] }>(
      API_CATEGORY + 'get-product-by-category-filter',
      data
    );
  }

  /**
   * SUB CATEGORY FILTER
   */
  getSubCategoryFilter(slug: string) {
    return this.http.get<{ data: any }>(
      API_SUB_CAT + 'get-sub-category-filter/' + slug
    );
  }

  /**
   * FILTER FILTER
   */
  getProductByFilters(
    query: object,
    sort: number,
    range?: any,
    paginate?: object,
    filteringData?: any
  ) {
    const data = {
      query,
      sort,
      range,
      paginate,
      filterData:
        filteringData && filteringData.length > 0 ? filteringData : null,
    };
    return this.http.post<{ data: Product[]; count: number }>(
      API_PRODUCT + 'get-products-by-ultimate-query',
      data
    );
  }

  /**
   * SEARCH SPLIT STRING REGEX
   */

  getSearchProduct(
    searchTerm: string,
    paginateObj?: object,
    sort?: string,
    filterQuery?: object
  ) {
    const paginate = paginateObj;
    const query = filterQuery;
    const data = {
      paginate,
      query,
    };
    let params = new HttpParams();
    params = params.append('q', searchTerm);
    params = params.append('s', sort);
    // params = params.append('pageSize', productPerPage);
    // params = params.append('page', currentPage);
    return this.http.post<{ data: Product[]; count: number }>(
      API_PRODUCT + 'get-products-by-regex-search',
      data,
      { params }
    );
  }

  /**
   * RANGE
   */
  getMaxMinPrice(query: object) {
    return this.http.post<{ data: any }>(
      API_PRODUCT + 'get-max-min-price/',
      query
    );
  }

  productFilterByMaxMin(
    query: object,
    range: any,
    sort: number,
    paginate?: object
  ) {
    const data = { query, paginate, range, sort };
    return this.http.post<{ data: Product[]; count: number }>(
      API_PRODUCT + 'product-filter-by-menu-navigate-min-max',
      data
    );
  }

  // filterByCatSubCatBrandFilters(data: any) {
  //   console.log(data);
  //   return this.http.post<{ data: Product[], count: number }>(API_PRODUCT + 'get-product-by-filter', data);
  // }

  // filterByCatFilters(data: any) {
  //   return this.http.post<{ data: Product[] }>(API_CATEGORY + 'get-product-by-category-filter', data);
  // }

  /**
   * UPDATE PRODUCT
   */

  updateProductImageField(id: string, images: ImageFormat[]) {
    return this.http.post<{ message: string }>(
      API_PRODUCT + 'update-product-images',
      { id, images }
    );
  }

  editProductData(product: any) {
    return this.http.post<{ message: string }>(
      API_PRODUCT + 'edit-product-data',
      product
    );
  }

  editProductBasicData(data: any) {
    return this.http.post<{ message: string }>(
      API_PRODUCT + 'edit-product-basic-data',
      data
    );
  }

  // router.post('/edit-product-basic-data', controller.editProductBasicData);

  /**
   * PAGINATION
   */

  getProductsByLimit(productPerPage: string, currentPage: string) {
    // const opts = { params: new HttpParams({fromString: '_page=1&_limit=10'}) };
    let params = new HttpParams();
    params = params.append('pageSize', productPerPage);
    params = params.append('page', currentPage);
    return this.http.get<{ data: Product[]; count: number }>(
      API_PRODUCT + 'products-by-limit',
      { params }
    );
  }

  getSpecificProductsById(ids: string[], select?: string) {
    console.log('Iam Here');
    return this.http.post<{ data: Product[] }>(
      API_PRODUCT + 'get-specific-products-by-ids',
      { ids, select }
    );
  }

  getRelatedProducts(data: any) {
    return this.http.get<{ data: any; message: string }>(
      API_PRODUCT +
        'get-related-products/' +
        data.category +
        '/' +
        data.subCategory +
        '/' +
        data.id
    );
  }
}

import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {SslInit} from '../interfaces/ssl-init';
import {Order} from '../interfaces/order';
import {Product} from '../interfaces/product';
import {Pagination} from '../interfaces/pagination';


const API_ORDER = environment.apiBaseLink + '/api/order/';
const API_ORDER_TEMP = environment.apiBaseLink + '/api/order-temporary/';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private httpClient: HttpClient
  ) { }


  /**
   * ORDER
   */
  placeOrder(data: Order) {
    return this.httpClient.post<{ orderId: string, message: string }>(API_ORDER + 'place-order', data);
  }

  placeTempOrder(data: Order) {
    return this.httpClient.post<{ orderId: string, message: string }>(API_ORDER_TEMP + 'place-temp-order', data);
  }

  updateOrderSessionKey(tranId: string, sessionkey: string) {
    return this.httpClient.post<{ message: string }>(API_ORDER_TEMP + 'update-session-key/' + tranId + '/' + sessionkey, {});
  }

  getAllOrdersByUser(pagination?: Pagination, select?: string) {
    let params = new HttpParams();

    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      if (select) {
        params = params.append('select', select);
      }
      return this.httpClient.get<{ data: Order[], count: number, message?: string }>
      (API_ORDER + 'get-all-orders-by-user', {params});
    } else {
      if (select) {
        params = params.append('select', select);
      }
      return this.httpClient.get<{ data: Order[], count: number, message?: string }>
      (API_ORDER + 'get-all-orders-by-user', {params});
    }
  }


  getOrderDetails(orderId: string) {
    return this.httpClient.get<{ data: Order, message?: string }>(API_ORDER + 'get-order-details/' + orderId);
  }

  cancelOrderByUser(orderId: string) {
    return this.httpClient.put<{ message: string, status: number }>(API_ORDER + 'cancel-order-by-user/' + orderId, {});
  }

  getAllTransactionByUser(pagination?: Pagination, select?: string) {
    let params = new HttpParams();

    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      if (select) {
        params = params.append('select', select);
      }
      return this.httpClient.get<{ data: Order[], count: number, message?: string }>
      (API_ORDER + 'get-all-transactions-by-user', {params});
    } else {
      if (select) {
        params = params.append('select', select);
      }
      return this.httpClient.get<{ data: Order[], count: number, message?: string }>
      (API_ORDER + 'get-all-transactions-by-user', {params});
    }
  }


  /**
   * ADMIN ACCESS
   */
  getAllOrdersByAdmin(pagination?: Pagination, select?: string, query?: any) {
    let params = new HttpParams();

    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      if (select) {
        params = params.append('select', select);
      }
      return this.httpClient.post<{ data: Order[], count: number, message?: string }>
      (API_ORDER + 'get-all-orders-by-admin', {query}, {params});
    } else {
      if (select) {
        params = params.append('select', select);
      }
      return this.httpClient.post<{ data: Order[], count: number, message?: string }>
      (API_ORDER + 'get-all-orders-by-admin', {query}, {params});
    }
  }

  changeOrderStatus(data: any) {
    return this.httpClient.put<{ message: string }>(API_ORDER + 'change-order-status' , data);
  }

  // router.get('/get-all-transaction-by-admin', checkAdminAuth, controller.getAllTransactionByAdmin);

  getAllTransactionByAdmin(pagination?: Pagination, select?: string) {
    let params = new HttpParams();

    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      if (select) {
        params = params.append('select', select);
      }
      return this.httpClient.get<{ data: Order[], count: number, message?: string }>
      (API_ORDER + 'get-all-transaction-by-admin', {params});
    } else {
      if (select) {
        params = params.append('select', select);
      }
      return this.httpClient.get<{ data: Order[], count: number, message?: string }>
      (API_ORDER + 'get-all-transaction-by-admin', {params});
    }
  }



}

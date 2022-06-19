import { Injectable } from '@angular/core';
import {AdminRoleData} from '../interfaces/admin-role-data';
import {DATABASE_KEY} from '../core/utils/global-variable';
import {EncryptStorage} from 'encrypt-storage';
import {environment} from "../../environments/environment";
// Encrypt
const encryptStorage = new EncryptStorage(environment.storageSecret);

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  /**
   * SESSION STORAGE
   */
  storeAdminRole(data: AdminRoleData) {
    sessionStorage.setItem(DATABASE_KEY.adminRoleData, JSON.stringify(data));
  }

  get adminRole(): AdminRoleData {
    const data = sessionStorage.getItem(DATABASE_KEY.adminRoleData);
    return JSON.parse(data) as AdminRoleData;
  }


  storeProductInputData(data: any) {
    sessionStorage.setItem(DATABASE_KEY.productFormData, JSON.stringify(data));
  }

  get storedProductInput(): any {
    const data = sessionStorage.getItem(DATABASE_KEY.productFormData);
    return JSON.parse(data);
  }

  /**
   * DYNAMIC SESSION DATA
   */
  storeInputData(data: any, key: string) {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  getStoredInput(key: string): any {
    const data = sessionStorage.getItem(key);
    return JSON.parse(data);
  }

  removeSessionData(key: string) {
    sessionStorage.removeItem(key);
  }



  /**
   * LOCAL STORAGE
   */
  storeAdminRoleToLocal(data: AdminRoleData) {
    localStorage.setItem(DATABASE_KEY.adminRoleData, JSON.stringify(data));
  }

  get adminRoleFromLocal(): AdminRoleData {
    const data = localStorage.getItem(DATABASE_KEY.adminRoleData);
    return JSON.parse(data) as AdminRoleData;
  }

  /**
   * ENCRYPT STORAGE
   */
  addDataToEncryptLocal(data: any, key: string) {
    encryptStorage.setItem(key, data);
  }

  getDataFromEncryptLocal(key: string) {
    return encryptStorage.getItem(key);
  }

  removeDataFromEncryptLocal(key: string) {
    encryptStorage.removeItem(key);
  }



}

import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {
  }


  addDataToLocalStorage(key: string, value: string) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getDataFromLocalStorage(key: string): any {
    const data = localStorage.getItem(key);
    if (data === null || data === undefined) {
      return null;
    }
    return JSON.parse(data);
  }

  deleteDataFromLocalStorage(key: string) {
    localStorage.removeItem(key);
  }


}

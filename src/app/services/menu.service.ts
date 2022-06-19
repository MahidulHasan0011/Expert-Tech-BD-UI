import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private refreshMenu = new Subject<void>();

  constructor() { }

  /**
   * refreshBranch
   */

  get refreshMenu$() {
    return this.refreshMenu;
  }

  needRefreshMenu$() {
    this.refreshMenu.next();
  }
}

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {SnackbarNotificationComponent} from '../shared/components/ui/snackbar-notification/snackbar-notification.component';
import {Cart} from '../interfaces/cart';
import {CartViewDialogComponent} from '../shared/components/cart-view-dialog/cart-view-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
  }


  /**
   * SNACKBAR
   */
  success(msg) {
    this.snackBar.openFromComponent(SnackbarNotificationComponent, {
      data: msg,
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['notification', 'success-new']
    });
  }

  warn(msg) {
    this.snackBar.openFromComponent(SnackbarNotificationComponent, {
      data: msg,
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['notification', 'warn']
    });
  }

  wrong(msg) {
    this.snackBar.openFromComponent(SnackbarNotificationComponent, {
      data: msg,
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['notification', 'wrong']
    });
  }

  /**
   * ADDITIONAL DIALOG
   */
  openCartViewDialog(data: Cart[]) {
    this.dialog.open(CartViewDialogComponent, {
      data,
      width: '90%',
      maxWidth: '1050px',
      disableClose: true
    });
  }


}

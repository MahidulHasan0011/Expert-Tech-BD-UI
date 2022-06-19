import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomerEditDialogComponent} from './customer-edit-dialog/customer-edit-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {isPlatformBrowser} from '@angular/common';
import {User} from "../../../interfaces/user";
import {ReloadService} from "../../../services/reload.service";
import {UserDataService} from "../../../services/user-data.service";
import {Pagination} from "../../../interfaces/pagination";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  customers: User[] = [];
  public holdPrevData: any[] = [];

  /*
   pagination
  */
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 24;
  totalProductsStore = 0;


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private reloadService: ReloadService,
    private customerService: UserDataService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    @Inject(PLATFORM_ID) public platformId: any
  ) {
  }

  ngOnInit(): void {

    // GET PAGE FROM QUERY PARAM
    this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getCustomerList();
    });

    this.reloadService.refreshUser$
      .subscribe(() => {
        this.getCustomerList();
      });

    // Get Gallery Data
    this.getCustomerList();
  }

  /**
   * HTTP REQ HANDLE
   */

  private getCustomerList() {
    this.spinner.show();
    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };
    this.customerService.getCustomerLists(pagination)
      .subscribe(res => {
        this.customers = res.data;
        this.holdPrevData = res.data;
        this.totalProducts = res.count;
        this.totalProductsStore = res.count;
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0,0);
        }
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }


  openUpdateOrderDialog(data: User) {
    this.dialog.open(CustomerEditDialogComponent, {
      data,
      panelClass: ['theme-dialog'],
      autoFocus: false,
      disableClose: false
    });
  }


}

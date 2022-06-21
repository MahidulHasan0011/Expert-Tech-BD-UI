import {Component, Inject, OnInit} from '@angular/core';
import {MatRadioChange} from '@angular/material/radio';
import {Address} from '../../../interfaces/address';
import {MatDialog} from '@angular/material/dialog';
import {UserDataService} from '../../../services/user-data.service';
import {ReloadService} from '../../../services/reload.service';
import {Cart} from '../../../interfaces/cart';
import {UiService} from '../../../services/ui.service';
import {CartService} from '../../../services/cart.service';
import {PricePipe} from '../../../shared/pipes/price.pipe';
import {Product} from '../../../interfaces/product';
import {Order, OrderItem} from '../../../interfaces/order';
import {UtilsService} from '../../../services/utils.service';
import {OrderStatus} from '../../../enum/order-status';
import {SslInit} from '../../../interfaces/ssl-init';
import {OrderService} from '../../../services/order.service';
import {PaymentSslService} from '../../../services/payment-ssl.service';
import {SslInitResponse} from '../../../interfaces/ssl-init-response';
import {ConfirmOrderDialogComponent} from './confirm-order-dialog/confirm-order-dialog.component';
import {Select} from '../../../interfaces/select';
import {Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {environment} from '../../../../environments/environment';
import {User} from '../../../interfaces/user';
import {DiscountTypeEnum} from '../../../enum/discount-type.enum';
import {ShippingChargeService} from '../../../services/shipping-charge';
import {ShippingCharge} from '../../../interfaces/shippingcharge';
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {AddNewAddressComponent} from "../../../shared/dialog-view/add-new-address/add-new-address.component";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  providers: [PricePipe]
})
export class CheckoutComponent implements OnInit {

  // Address
  userAddress: Address[] = [];
  selectedAddressIndex = 0;

  // CARTS
  carts: Cart[] = [];

  // NOTES
  orderNotes = '';

  // TERMS
  isAccept = false;

  // Store Order Data
  order: Order = null;

  // PAYMENT DATA
  currency = 'BDT';
  shippingMethod: 'Courier';
  shippingType = 'Courier';
  productsNameStr: string = null;
  productsCatStr: string = null;

  // PAYMENT TYPES
  paymentTypes: Select[] = [
    {value: 'cash_on_delivery', viewValue: 'Cash on Delivery'},
    {value: 'online_payment', viewValue: 'Online Payment or Bkash, Nagad or Rocket'},
  ];

  isEMI = true;

  emi: Select[] = [
    {value: 0, viewValue: 'No EMI'},
    {value: 1, viewValue: 'EMI'},
  ];

  emiOptions: Select[] = [
    {value: 3, viewValue: '3 Months'},
    {value: 6, viewValue: '6 Months'},
    {value: 9, viewValue: '9 Months'},
  ];

  selectedPaymentType = 'cash_on_delivery';
  selectedEMI = 0;
  selectedEMIOption = 3;

  user: User = null;

  shippingchargedata: ShippingCharge;


  constructor(
    private dialog: MatDialog,
    private userDataService: UserDataService,
    private reloadService: ReloadService,
    private uiService: UiService,
    private cartService: CartService,
    private pricePipe: PricePipe,
    private utilsService: UtilsService,
    private orderService: OrderService,
    private paymentSslService: PaymentSslService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private shippingChargeService: ShippingChargeService
  ) {
  }

  ngOnInit(): void {

    this.reloadService.refreshAddress$.subscribe(() => {
      this.getUserAddress();
    });

    // GET DATA
    this.getLoggedInUserInfo();
    this.getUserAddress();
    this.getShippingCharge();
    this.getCartItemList();
  }



  onChangeAddress(event: MatRadioChange) {
    this.selectedAddressIndex = event.value;
  }

  /**
   * COMPONENT DIALOG VIEW
   */

  openAddNewAddressDialog(address?: Address) {
    this.dialog.open(AddNewAddressComponent, {
      // data: {
      //   address: address,
      //   user: this.user
      // },
      data: address,
      panelClass: ['theme-dialog'],
      maxHeight: '600px',
      autoFocus: false,
      disableClose: false
    });
  }

  openConfirmOrderDialog() {
    const dialogRef = this.dialog.open(ConfirmOrderDialogComponent, {
      data: {
        order: this.order,
        carts: this.carts,
        selectedPaymentType: this.selectedPaymentType
      },
      panelClass: ['theme-dialog'],
      width: '90%',
      maxWidth: '1050px',
      maxHeight: '800px',
      autoFocus: false,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      console.log('dialogResult:', dialogResult);
      if (dialogResult) {
        if (dialogResult.isConfirm) {
          if (this.selectedPaymentType === 'cash_on_delivery') {
            this.saveOrderInformationToMain();
          } else {
            this.saveOrderInformationToTemp();
          }
        }
      }
    });
  }


  public openConfirmDialog(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this address?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteUserAddress(id);
      }
    });
  }


  /**
   * HTTP REQ HANDLE
   * LOCAL STORAGE HANDLE
   */

  private getShippingCharge() {
    this.shippingChargeService.getExtraPriceInfo()
      .subscribe(res => {
        this.shippingchargedata = res.data;
      }, err => {
        console.log(err);
      });
  }

  private deleteUserAddress(id: string) {
    this.userDataService.deleteAddress(id)
      .subscribe((res) => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshAddress$();
      }, err => {
        console.log(err);
      });
  }


  private getLoggedInUserInfo() {
    const select = '-password';
    this.userDataService.getLoggedInUserInfo(select)
      .subscribe(res => {
        this.user = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getUserAddress() {
    this.userDataService.getAllAddress()
      .subscribe((res) => {
        this.userAddress = res.data;
      }, err => {
        console.log(err);
      });
  }

  private getCartItemList() {
    this.cartService.getCartItemList()
      .subscribe(res => {
        this.carts = res.data;
        const productNames = this.carts.map(m => {
          const product = m.product as Product;
          if (product.isEMI === false) {
            this.isEMI = false;
          }
          return product.name;
        });
        const productCategories = this.carts.map(m => {
          const product = m.product as Product;
          return product.categorySlug;
        });
        this.productsNameStr = productNames.join();
        this.productsCatStr = productCategories.join();

      }, error => {
        console.log(error);
      });
  }

  private saveOrderInformationToMain() {
    this.orderService.placeOrder(this.order)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.router.navigate(['/account/order-list']);
      }, error => {
        console.log(error);
      });
  }

  private saveOrderInformationToTemp() {
    this.orderService.placeTempOrder(this.order)
      .subscribe(res => {
        this.sslInitWithOrder(res.orderId);
      }, error => {
        console.log(error);
      });
  }

  /**
   * CALCULATION
   */

  get cartSubTotal(): number {
    return this.carts.map(t => {
      return this.pricePipe.transform(t.product as Product, 'priceWithDiscount', t.selectedQty) as number;
    }).reduce((acc, value) => acc + value, 0);
  }

  get cartTotalDiscount(): number {
    return this.carts.map(t => {
      return this.pricePipe.transform(t.product as Product, 'discountPrice', t.selectedQty) as number;
    }).reduce((acc, value) => acc + value, 0);
  }


  /**
   * MAIN PLACE ORDER
   */
  placeOrder() {


    if (this.userAddress.length <= 0) {
      this.uiService.warn('Please select correct shipping address');
      return;
    }

    if (!this.isAccept) {
      this.uiService.warn('Please accept our terms and conditions con continue');
      return;
    }

    const products = this.carts.map(m => {
      const product = m.product as Product;
      return {
        product: product._id,
        price: this.pricePipe.transform(product as Product, 'priceWithDiscount') as number,
        discountType: DiscountTypeEnum.PERCENTAGE,
        discountAmount: product.discount,
        quantity: m.selectedQty,
        orderType: 'regular',
      } as OrderItem;
    });


    this.order = {
      paymentMethod: this.selectedPaymentType,
      checkoutDate: this.utilsService.getDateWithCurrentTime(new Date()),
      name: this.userAddress[this.selectedAddressIndex].name,
      phoneNo: this.userAddress[this.selectedAddressIndex].phoneNo,
      email: this.userAddress[this.selectedAddressIndex].email,
      alternativePhoneNo: this.userAddress[this.selectedAddressIndex].alternativePhoneNo,
      area: '',
      city: this.userAddress[this.selectedAddressIndex].city,
      postCode: '',
      shippingAddress: this.userAddress[this.selectedAddressIndex].shippingAddress,
      deliveryDate: null,
      deliveryStatus: OrderStatus.PENDING,
      shippingFee: this.shippingchargedata?.deliveryInDhaka,
      subTotal: this.cartSubTotal,
      discount: this.cartTotalDiscount,
      totalAmount: this.cartSubTotal + (this.shippingchargedata?.deliveryInDhaka),
      paymentStatus: 'unpaid',
      hasPreorderItem: false,
      couponId: null,
      couponValue: null,
      orderedItems: products,
      orderNotes: this.orderNotes,
      sessionkey: null
    };

    console.log(this.order);

    this.openConfirmOrderDialog();

  }

  private sslInitWithOrder(orderId: string) {
    const baseHost = this.utilsService.getHostBaseUrl();

    const sslPaymentInit: SslInit = {
      store_id: null,
      store_passwd: null,
      total_amount: this.order.totalAmount,
      currency: this.currency,
      tran_id: orderId,
      success_url: baseHost + '/callback/payment/success',
      fail_url: baseHost + '/callback/payment/fail',
      cancel_url: baseHost + '/callback/payment/cancel',
      ipn_url: environment.sslIpnUrl,
      shipping_method: 'Courier',
      product_name: this.productsNameStr,
      product_category: this.productsCatStr,
      product_profile: 'general',
      emi_option: this.selectedEMI,
      emi_max_inst_option: 9,
      emi_selected_inst: this.selectedEMIOption,
      emi_allow_only: 1,
      cus_name: this.order.name,
      cus_email: this.order.email ? this.order.email : 'contact@softlabit.com',
      cus_add1: this.order.shippingAddress,
      cus_add2: '',
      cus_city: this.order.city,
      cus_state: '',
      cus_postcode: this.order.postCode ? this.order.postCode : '1216',
      cus_country: 'Bangladesh',
      cus_phone: this.order.phoneNo,
      cus_fax: '',
      ship_name: this.order.name,
      ship_add1: this.order.shippingAddress,
      ship_add2: '',
      ship_city: this.order.city,
      ship_state: '',
      ship_postcode: this.order.postCode ? this.order.postCode : '1216',
      ship_country: 'Bangladesh',
      // multi_card_name: '',
      value_a: this.order.orderNotes,
      // value_b: '',
      // value_c: '',
      // value_d: ''
    };

    console.log(sslPaymentInit);

    this.paymentSslService.initSSLPayment(sslPaymentInit)
      .subscribe(res => {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
        console.log(res.data);
        const sslInitResponse: SslInitResponse = res.data;
        const sessionkey = sslInitResponse.sessionkey;
        this.orderService.updateOrderSessionKey(orderId, sessionkey)
          .subscribe(res3 => {
            const gatewayPageURL = sslInitResponse.GatewayPageURL;
            // window.open(gatewayPageURL);
            this.document.location.href = gatewayPageURL ? gatewayPageURL : '';
          }, error => {
            this.uiService.wrong('This order could not be processed at this time, please try again.');
          });

      }, error => {
        console.log(error);
      });
  }

  get minimumPayment(): number {
    return  Math.floor((this.cartSubTotal + this.shippingchargedata?.deliveryInDhaka) * 0.1);
  }



}

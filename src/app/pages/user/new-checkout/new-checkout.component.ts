import { ThrowStmt } from '@angular/compiler';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DiscountTypeEnum } from 'src/app/enum/discount-type.enum';
import { OrderStatus } from 'src/app/enum/order-status';
import { Cart } from 'src/app/interfaces/cart';
import { Order, OrderItem } from 'src/app/interfaces/order';
import { Product } from 'src/app/interfaces/product';
import { Select } from 'src/app/interfaces/select';
import { ShippingCharge } from 'src/app/interfaces/shippingcharge';
import { SslInit } from 'src/app/interfaces/ssl-init';
import { SslInitResponse } from 'src/app/interfaces/ssl-init-response';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { PaymentSslService } from 'src/app/services/payment-ssl.service';
import { ProductService } from 'src/app/services/product.service';
import { ReloadService } from 'src/app/services/reload.service';
import { ShippingChargeService } from 'src/app/services/shipping-charge';
import { StorageService } from 'src/app/services/storage.service';
import { UiService } from 'src/app/services/ui.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/services/utils.service';
import { PricePipe } from 'src/app/shared/pipes/price.pipe';
import { environment } from 'src/environments/environment';
import {DATABASE_KEY} from '../../../core/utils/global-variable';
import { ConfirmOrderDialogComponent } from '../checkout/confirm-order-dialog/confirm-order-dialog.component';
import {DOCUMENT} from '@angular/common';
import { User } from 'src/app/interfaces/user';
import { NgxSpinnerService } from 'ngx-spinner';
// import { I } from '@angular/cdk/keycodes';
@Component({
  selector: 'app-new-checkout',
  templateUrl: './new-checkout.component.html',
  styleUrls: ['./new-checkout.component.scss'],
  providers:[PricePipe]
})
export class NewCheckoutComponent implements OnInit {
  // @Output() newItemEvent = new EventEmitter();
  /*  */
  requiredCheck:boolean=true;
  hide = true;
  public dataForm:FormGroup;
  public loginDataForm:FormGroup;
  shippingNdelivery=false;
  // shippingchargedata:ShippingCharge
  regions:any[]=[]
  isUser:boolean=false;
  isEMI = true;
//pass
  isHiddenPass = true;
  isHiddenConPass = true;
  //Cart
  carts: Cart[] = [];
  // FOR RESET
  @ViewChild('formTemplate') formTemplate: NgForm;

  // public dataForm:FormGroup
  userState:string;
  isLoggedInUser:boolean=false
  //Order
  order:Order
  //Cart
  // carts: Cart[] = [];
  shippingchargedata:ShippingCharge;
  delivery: Select[] = [
    {value: 0, viewValue: 'Home Delivery'},
    {value: 1, viewValue: 'Store Pickup'},
  ];
  options:Select[]=[
    {value: 0, viewValue: 'Login'},
    {value: 1, viewValue: 'Register'},
  ]

  headLine = true;

  // PAYMENT DATA
  currency = 'BDT';
  // shippingMethod: 'Courier';
  shippingType = 'Courier';
  productsNameStr: string = null;
  productsCatStr: string = null;


  // PAYMENT TYPES
  paymentTypes: Select[] = [
    {value: 'cash_on_delivery', viewValue: 'Cash on Delivery'},
    {value: 'online_payment', viewValue: 'Online Payment'},
  ];
  cities:Select[]=[
    {value: 'dhaka', viewValue: 'Dhaka'},
    {value: 'chittagong', viewValue: 'Chittagong'},
    {value: 'khulna', viewValue: 'Khulna'},
    {value: 'barisal', viewValue: 'Barisal'},
    {value: 'sylhet', viewValue: 'Sylhet'},
    {value: 'rajshahi', viewValue: 'Rajshahi'},
    {value: 'rangpur', viewValue: 'Rangpur'},
    {value: 'mymenshing', viewValue: 'Mymenshing'},

  ]
  selectedEMI = 0;
  selectedEMIOption = 3;
  selectedDeliveryOption = 0;
  authOption=1;
  selectedPaymentType = 'cash_on_delivery';
  shippingMethod=0;
  selectedShippingCity="";
  selectedDeliveryCity="";

  public date = new Date()

  constructor(
    private dialog: MatDialog,
    private userService:UserService,
    private cartService:CartService,
    private reloadService:ReloadService,
    private uiService:UiService,
    private shippingChargeService:ShippingChargeService,
    private pricePipe:PricePipe,
    private productService:ProductService,
    private storageService:StorageService,
    private userDataService:UserDataService,
    private fb: FormBuilder,
    private utilsService:UtilsService,
    private orderService:OrderService,
    private router:Router,
    private paymentSslService:PaymentSslService,
    private spinner: NgxSpinnerService,

    @Inject(DOCUMENT) private document: Document,
  ) { }

  ngOnInit(): void {
    this.initFormValue()
    this.initLoginValue();
    if(!this.userService.getUserStatus()){
      this.initFormValue()
      this.initLoginValue()
    }
    else{
      this.isUser=true;
      this.userDataService.getLoggedInUserInfo()
        .subscribe((res)=>{
          console.log(res.data);
          this.fetchFormData(res.data)
        })
    }

    // this.reloadService.needRefreshUser$
    this.reloadService.refreshCart$.subscribe(() => {
      this.getCartsItems();
    });
    this.getCartsItems();
    this.reloadService.refreshUser$.subscribe(()=>{
      console.log("USER STAUS")
      this.isUser=true;
      this.userDataService.getLoggedInUserInfo()
        .subscribe((res)=>{
          console.log(res.data);
          this.fetchFormData(res.data)

        })
    })
    this.getUserInfo();
    this.getShippingCharge();

    console.log('Checking My Date', this.date)
  }

  /* Init From */
  initFormValue(){
    // this.shippingNdelivery=true;
    this.dataForm = this.fb.group({
      fullName:[null,Validators.required],

      phoneNo: [null,Validators.required],
      email: [null, Validators.required],
      password:[null],
      confirmPassword:[null],
      shippingAddress: [null, Validators.required],
      shippingName:[null],
      billingAddress:[null],
      selectedShippingCity:[null],
      selectedDeliveryCity:[null],
    });
  }
  initLoginValue(){
    this.loginDataForm=this.fb.group({
      username:[null],
      password:[null]
    })
  }

  fetchFormData(data:User){
    this.dataForm.patchValue(data);
    // this.dataForm.value.thana=this.dataForm.value.city;
    console.log(data)

    console.log(this.dataForm.value)
  }
  /**
   * CART DATA
   */
  private getCartsItems() {
    if (this.userService.getUserStatus()) {

      this.getCartItemList();
    } else {
      this.getCarsItemFromLocal();
    }

  }
  /**
   * CART FUNCTIONALITY
   */
  onDeleteCartItem(cartId: string, product: string) {
    console.log(cartId," ",product)
    if (this.userService.getUserStatus()) {
      this.removeCartItem(cartId);
    } else {
      this.cartService.deleteCartItemFromLocalStorage(product);
      this.reloadService.needRefreshCart$();
    }
  }

  /**
   * LOGICAL METHODS
   */

  incrementQty(cartId: string, index: number) {
    if (this.userService.getUserStatus()) {
      this.incrementCartQtyDB(cartId);
    } else {
      const data = this.cartService.getCartItemFromLocalStorage();
      if (data != null) {
        data[index].selectedQty = data[index].selectedQty + 1;
        localStorage.setItem(DATABASE_KEY.userCart, JSON.stringify(data));
        this.reloadService.needRefreshCart$();
      }
      console.log(data)
    }
  }

  decrementQty(cartId: string, index: number, sQty: number) {
    if (this.userService.getUserStatus()) {
      if (sQty === 1) {
        this.uiService.warn('Minimum quantity is 1');
        return;
      }
      this.decrementCartQtyDB(cartId);
    } else {
      const data = this.cartService.getCartItemFromLocalStorage();
      if (data[index].selectedQty === 1) {
        return;
      }
      if (data != null) {
        data[index].selectedQty = data[index].selectedQty - 1;
        localStorage.setItem(DATABASE_KEY.userCart, JSON.stringify(data));
        this.reloadService.needRefreshCart$();
      }
    }

  }

  /**
   * CALCULATION
   */

  get cartSubTotal() {
    return this.carts.map(t => {
      return this.pricePipe.transform(t.product as Product, 'priceWithDiscount', t.selectedQty) as number;
    }).reduce((acc, value) => acc + value, 0);
  }

  /* http */
  private getUserInfo(){
    const isUser=this.userService.getUserStatus()
    if(isUser){
      this.isLoggedInUser=true;

    }
  }
  private getShippingCharge() {
    this.shippingChargeService.getExtraPriceInfo()
      .subscribe(res => {
        this.shippingchargedata = res.data;
      }, err => {
        console.log(err);
      });
  }
  private getCartItemList() {
    this.cartService.getCartItemList()
      .subscribe(res => {
        this.carts = res.data;
        console.log(this.carts);
      }, error => {
        console.log(error);
      });
  }
  private getCarsItemFromLocal() {
    const items = this.cartService.getCartItemFromLocalStorage();
    console.log(items)
    if (items && items.length > 0) {
      const ids: string[] = items.map(m => m.product as string);
      this.productService.getSpecificProductsById(ids, 'name slug salePrice discount discountType quantity images productImages')
        .subscribe(res => {
          const products = res.data;
          if (products && products.length > 0) {
            this.carts = items.map(t1 => ({...t1, ...{product: products.find(t2 => t2._id === t1.product)}}));
            console.log(this.carts);
          }
        });
    } else {
      this.carts = [];
    }
  }
  private removeCartItem(cartId: string) {
    this.cartService.removeCartItem(cartId)
      .subscribe(() => {
        this.reloadService.needRefreshCart$();
      }, error => {
        console.log(error);
      });
  }

  private incrementCartQtyDB(cartId: string) {
    this.cartService.incrementCartQuantity(cartId)
      .subscribe(() => {
        this.reloadService.needRefreshCart$();
      }, error => {
        console.log(error);
      });
  }

  private decrementCartQtyDB(cartId: string) {
    this.cartService.decrementCartQuantity(cartId)
      .subscribe(() => {
        this.reloadService.needRefreshCart$();
      }, error => {
        console.log(error);
      });
  }
  /* Order Submission */
  onSubmitOrder(newValue,isLogginIn?:boolean){
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
      checkoutDate: this.date,
      // checkoutDate: this.utilsService.getDateWithCurrentTime(new Date()),
      name: newValue.fullName,
      phoneNo: newValue.phoneNo,
      email: newValue.email,
      alternativePhoneNo: newValue.phoneNo,
      area: newValue.selectedDeliveryCity,
      city: newValue.selectedShippingCity,
      postCode: '',
      shippingAddress: newValue.shippingAddress,
      deliveryDate: null,
      deliveryStatus: OrderStatus.PENDING,
      shippingFee:  this.shippingMethod===0?this.shippingchargedata?.deliveryInDhaka:0,
      subTotal: this.cartSubTotal,
      discount: this.cartTotalDiscount,
      totalAmount: this.shippingMethod===0? this.cartSubTotal + (this.shippingchargedata?.deliveryInDhaka):this.cartSubTotal,
      paymentStatus: 'unpaid',
      hasPreorderItem: false,
      couponId: null,
      couponValue: null,
      orderedItems: products,
      orderNotes: newValue.comment,
      sessionkey: null
    };

    console.log(this.order);
    if(!isLogginIn){
      this.openConfirmOrderDialog();
    }
    // if(this.isUser){
    // }

  }
  get cartTotalDiscount(): number {
    return this.carts.map(t => {
      return this.pricePipe.transform(t.product as Product, 'discountPrice', t.selectedQty) as number;
    }).reduce((acc, value) => acc + value, 0);
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
      this.reloadService.needRefreshUser$
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
        //  console.log(res.orderId)
      }, error => {
        console.log(error);
      });
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
      cus_email: this.order.email ? this.order.email : 'roneuser@gmail.com',
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

    // console.log(sslPaymentInit);

    this.paymentSslService.initSSLPayment(sslPaymentInit)
      .subscribe(res => {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
        // console.log(res.data);
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
// confirm order
  addItem(value){
    this.onSubmitOrder(value)
  }

  onConfirmOrder(){
    this.onSubmitForm()
  }
  onSubmitForm(){
    // console.log(this.requiredCheck)
    if(!this.requiredCheck){
      this.uiService.warn('Please check The terms and conditions');
      return;
    }
    if (this.dataForm.invalid) {
      // console.log(this.dataForm.value);
      this.uiService.warn('invalid');
      return;
    }
    if(!this.isUser){
      this.registerNewUser();

      //  return;
    }
    this.addItem(this.dataForm.value);
    // this.newItemEvent.emit(this.dataForm.value);
    // console.log(this.dataForm.value)
  }

  registerNewUser(){
    if (this.dataForm.invalid) {
      return;
    }

    if (this.dataForm.value.password !== this.dataForm.value.confirmPassword ) {
      this.uiService.warn('Password and confirm password not matched');
      return;
    }

    if ( !this.dataForm.value.email) {
      this.uiService.warn('Must provide an valid email');
      return;
    }

    this.spinner.show();


    const data: User = {
      fullName: this.dataForm.value.fullName,
      phoneNo: this.dataForm.value.phoneNo,
      email:this.dataForm.value.email,
      password: this.dataForm.value.password,
      birthdate: null,
      gender: this.dataForm.value.gender,
      isPhoneVerified:true,
      registrationType: 'phone',
      isEmailVerified: false,
      hasAccess: true,
      username:this.dataForm.value.phoneNo,
    };


    this.userService.userRegistration(data,"auth-checkout");
  }
  onSubmitLogin(){
    this.userService.userLogin(this.loginDataForm.value,"auth-checkout","login")
    // this.addItem(this.dataForm.value);
    this.onSubmitOrder(this.dataForm.value,true)


  }
// onCheckRequired(){
//   this.requiredCheck=!this.requiredCheck
//   console.log(this.requiredCheck);
// }

  /****
   * HEADLINE HIDE
   */
  headLinkHide(){
    this.headLine = false;
  }

  public getTotalPrice(unit:number,quantity:number){
    console.log(unit,quantity)
    return unit*quantity*2
  }
}

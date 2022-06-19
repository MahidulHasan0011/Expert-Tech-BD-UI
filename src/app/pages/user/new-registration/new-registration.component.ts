
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Cart } from 'src/app/interfaces/cart';
import { Product } from 'src/app/interfaces/product';
import { Select } from 'src/app/interfaces/select';
import { ShippingCharge } from 'src/app/interfaces/shippingcharge';
import { SupplyAddressInfo } from 'src/app/interfaces/supply-address-info';
import { User } from 'src/app/interfaces/user';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { ReloadService } from 'src/app/services/reload.service';
import { ShippingChargeService } from 'src/app/services/shipping-charge';
import { UiService } from 'src/app/services/ui.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/services/user.service';
import { PricePipe } from 'src/app/shared/pipes/price.pipe';


@Component({
  selector: 'app-new-registration',
  templateUrl: './new-registration.component.html',
  styleUrls: ['./new-registration.component.scss'],
  // providers: [PricePipe]
})
export class NewRegistrationComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<SupplyAddressInfo>();

  hide = true;
  public dataForm:FormGroup;
  shippingNdelivery=false;
  shippingchargedata:ShippingCharge
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

  constructor(
    private fb: FormBuilder,
    private uiService:UiService,
    private userDataService:UserDataService,
     private userService:UserService,
     private spinner: NgxSpinnerService,
    // private cartService:CartService,
    // private reloadService:ReloadService,
    // private productService:ProductService,
    // private pricePipe: PricePipe,
    // private shippingChargeService:ShippingChargeService
  ) { }

  ngOnInit(): void {
    this.initFormValue()
    // this.reloadService.refreshCart$.subscribe(() => {
    //   this.getCartsItems();
    // });
    // this.getCartsItems();
    if(!this.userService.getUserStatus()){ 
    this.initFormValue()
    }
    else{
      this.isUser=true;
      this.userDataService.getLoggedInUserInfo()
      .subscribe((res)=>{
        console.log(res.data);
        this.fetchFormData(res.data)
      })
    }
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
      city:[null,Validators.required],
      // fullName: [null, Validators.required],
      thana: [null,Validators.required],
      comment:[null],
    });
  }

  fetchFormData(data:User){
    this.dataForm.patchValue(data);
    // this.dataForm.value.thana=this.dataForm.value.city;
    console.log(data)

    console.log(this.dataForm.value)
  }
  /* Chnage Check */
  onCheckChange(){
    // this.shippingNdelivery=!this.shippingNdelivery
    // console.log(this.shippingNdelivery)
    // if(this.shippingNdelivery){
    //   console.log("IF")
    //   this.dataForm.get('shippingAddress').setValidators(Validators.required);
    //   this.dataForm.get('shippingName').setValidators(Validators.required);
    // }
    // if(!this.shippingNdelivery){
    //   this.dataForm.get('shippingAddress').clearValidators();
    //   this.dataForm.get('shippingName').clearValidators();
    // }

  }


  
  /* Form Submission */
  onSubmitForm(){
    if (this.dataForm.invalid) {
     // console.log(this.dataForm.value);
      this.uiService.warn('invalid');
      return;
    }
     if(!this.isUser){
       this.registerNewUser();

      //  return;
     }
    this.newItemEvent.emit(this.dataForm.value);
    // console.log(this.dataForm.value)               
  }

  /* Http req handle */
  
  
  
  
     /**
   * CART DATA
   */
  // private getCartsItems() {
  //   if (this.userService.getUserStatus()) {
  //     this.getCartItemList();
  //   } else {
  //     this.getCarsItemFromLocal();
  //   }

  // }
  
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


    this.userService.userRegistration(data,"checkout");
  }

  ontest(){
    console.log("TESTI");
  }
}

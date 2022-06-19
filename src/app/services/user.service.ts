import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {UiService} from './ui.service';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {User} from '../interfaces/user';
import {DATABASE_KEY} from '../core/utils/global-variable';
import {NgxSpinnerService} from 'ngx-spinner';
import {CartService} from './cart.service';
import {ProductService} from './product.service';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase/app';
import 'firebase/auth';
import { ReloadService } from './reload.service';

const API_USER = environment.apiBaseLink + '/api/user/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private token: string;
  private isUser = false;
  private userStatusListener = new Subject<boolean>();
  // Hold The Count Time..
  private tokenTimer: any;

  constructor(
    private httpClient: HttpClient,
    private uiService: UiService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private cartService: CartService,
    private productService: ProductService,
    private afAuth: AngularFireAuth,
    private reloadService:ReloadService,
  ) {
  }

  /**
   * USER REGISTRATION
   */

  userRegistration(data: User, redirectForm?: string) {
    this.httpClient.post<{ token: string, expiredIn: number }>(API_USER + 'registration', data)
      .subscribe(res => {
        const getToken = res.token;
        this.token = getToken;
        // Make User Auth True..
        this.spinner.hide();
        if (getToken) {
          this.onSuccessLogin(getToken, res.expiredIn, redirectForm, true);
        }
      }, () => {
        this.isUser = false;
        this.userStatusListener.next(false);
        this.spinner.hide();
      });
  }

  userLogin(data: { username: string, password: string }, redirectFrom?: string,isLogginIn?:string) {
    // console.log(data)
    this.httpClient.put<{ token: string, expiredIn: number }>(API_USER + 'login', data)
      .subscribe(response => {
        const getToken = response.token;
        this.token = getToken;
        // Make User Auth True..
        if (getToken) {
          if(isLogginIn){
            this.onSuccessLogin(getToken, response.expiredIn, redirectFrom,false,isLogginIn);
           
          }
          this.onSuccessLogin(getToken, response.expiredIn, redirectFrom);
        }
      }, () => {
        this.isUser = false;
        this.userStatusListener.next(false);
        this.spinner.hide();
      });
  }

  /**
   * ON SUCCESS LOGIN
   */

  private onSuccessLogin(token: string, expiredIn: number, redirectFrom?: string, fromRegistration?: boolean,isLoggingIn?:string) {
    this.isUser = true;
    this.userStatusListener.next(true);

    // For Token Expired Time..
    const expiredInDuration = expiredIn;
    this.setSessionTimer(expiredInDuration);

    // Save Login Time & Expiration Time & Token to Local Storage..
    const now = new Date();
    const expirationDate = new Date(now.getTime() + expiredInDuration * 1000);
    this.saveUserData(token, expirationDate);

    //
     this.reloadService.needRefreshUser$;
    if(isLoggingIn==="login"){
      window.location.reload();
    }
    // Snack bar..
    this.uiService.success('Welcome! Login Success.');
    // Spinner
    this.spinner.hide();

    // SYNC CART ITEM
    if(redirectFrom!="checkout"){ 
    this.getCarsItemFromLocal();
    }

    // Navigate with Auth..
    if (redirectFrom) {
        if(redirectFrom==="checkout"){
          this.router.navigate(['auth-checkout']);
        }
        else{ 
        this.router.navigate([redirectFrom]);
        }
      
    } else {

      this.router.navigate([environment.userBaseUrl]);
      
    }
  }

  /**
   * FACEBOOK LOGIN
   */

  AuthLogin(provider, registrationType: string) {
    return this.afAuth.signInWithPopup(provider)
      .then((credential) => {
        const user: User = {
          fullName: credential.user.displayName,
          username: credential.user.uid,
          password: null,
          phoneNo: credential.user.phoneNumber,
          profileImg: credential.user.phoneNumber,
          isPhoneVerified: false,
          email: credential.user.email,
          hasAccess: true,
          registrationType,
          isEmailVerified: false,
          registrationAt: new Date(),
        };
        this.facebookLoginWithMongo(user);
      }).catch((error) => {
        console.log(error);
      });
  }

  FacebookAuth() {
    return this.AuthLogin(new firebase.auth.FacebookAuthProvider(), 'facebook');
  }

  GoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider(), 'facebook');
  }

  facebookLoginWithMongo(credential: User) {
    this.httpClient.post<{ token: string, expiredIn: number }>(API_USER + 'facebook-login', credential)
      .subscribe(res => {
        const getToken = res.token;
        this.token = getToken;
        // Make User Auth True..
        if (getToken) {
          this.onSuccessLogin(getToken, res.expiredIn);
        }
      }, () => {
        this.isUser = false;
        this.userStatusListener.next(false);
        // console.log(error);
      });
  }

  /**
   * User Auto Login
   */
  autoUserLoggedIn() {
    const authInformation = this.getUserData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expiredDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userStatusListener.next(true);
      this.isUser = true;
      this.setSessionTimer(expiresIn / 10000);
    }
  }

  /**
   * AUTH SESSION
   * SAVE USER DATA
   * CLEAR USER DATA
   */

  private setSessionTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
    }, duration * 1000);
  }

  protected saveUserData(token: string, expiredDate: Date) {
    localStorage.setItem(DATABASE_KEY.loginToken, token);
    localStorage.setItem(DATABASE_KEY.loggInSession, expiredDate.toISOString());
  }

  protected getUserData() {
    const token = localStorage.getItem(DATABASE_KEY.loginToken);
    const expirationDate = localStorage.getItem(DATABASE_KEY.loggInSession);

    if (!token && !expirationDate) {
      return;
    }
    return {
      token,
      expiredDate: new Date(expirationDate)
    };
  }

  protected clearUserData() {
    localStorage.removeItem(DATABASE_KEY.loginToken);
    localStorage.removeItem(DATABASE_KEY.loggInSession);
  }


  /**
   * MIDDLEWARE OF AUTH STATUS
   */
  getUserToken() {
    return this.token;
  }

  getUserStatusListener() {
    return this.userStatusListener.asObservable();
  }

  getUserStatus() {
    return this.isUser;
  }


  /**
   * User Logout
   */
  userLogOut() {
    this.token = null;
    this.isUser = false;
    this.userStatusListener.next(false);
    // Clear Token from Storage..
    this.clearUserData();
    // Clear The Token Time..
    clearTimeout(this.tokenTimer);
    // Navigate..
    this.router.navigate([environment.appBaseUrl]);
  }


  /**
   * CHECK USER PHONE
   */

  checkAndGetUserByPhone(phoneNo: string) {
    return this.httpClient.get<{ data: boolean, message: string }>(API_USER + 'check-user-by-phone/' + phoneNo);
  }

  /**
   * CART SYNC FROM LOCAL
   */
  private getCarsItemFromLocal() {
    const items = this.cartService.getCartItemFromLocalStorage();

    if (items && items.length > 0) {
      const ids: string[] = items.map(m => m.product as string);
      this.productService.getSpecificProductsById(ids, 'name slug salePrice discount quantity images')
        .subscribe(res => {
          const products = res.data;
          if (products && products.length > 0) {
            const cartsItems = items.map(t1 => ({...t1, ...{product: products.find(t2 => t2._id === t1.product)}}));

            //  this.uiService.openCartViewDialog(cartsItems);
          }
        });
    }
  }


}

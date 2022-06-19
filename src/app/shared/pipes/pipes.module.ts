import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AddressPipe} from './address.pipe';
import {PricePipe} from './price.pipe';
import {SafeHtmlCustomPipe} from './safe-html.pipe';
import {SortPipe} from './sort.pipe';
import {RoleModifyPipe} from './role-modify.pipe';
import {NumberMinDigitPipe} from './number-min-digit.pipe';
import {SlugToNormalPipe} from './slug-to-normal.pipe';
import {OrderStatusPipe} from './order-status.pipe';
import {FilterByIdPipe} from './filter-by-id.pipe';
import {FilterBrandsPipe} from './filter-brands.pipe';
import {BrandSearchPipe} from './brand-search.pipe';
import {ProfilePicturePipe} from './profilePicture.pipe';
import {UserSearchPipe} from './user-search.pipe';
import {CartPricePipe} from './cart-price.pipe';
import {FilterSelectedPipe} from './filter-selected.pipe';
import {FormatBytesPipe} from "./format-bytes.pipe";
import { ProductImagePipe } from './product-image.pipe';



@NgModule({
    declarations: [
        AddressPipe,
        PricePipe,
        SafeHtmlCustomPipe,
        SortPipe,
        RoleModifyPipe,
        NumberMinDigitPipe,
        SlugToNormalPipe,
        OrderStatusPipe,
        FilterByIdPipe,
        FilterBrandsPipe,
        BrandSearchPipe,
        ProfilePicturePipe,
        UserSearchPipe,
        CartPricePipe,
        FilterSelectedPipe,
        FormatBytesPipe,
        ProductImagePipe
    ],
  imports: [
    CommonModule
  ],
    exports: [
        AddressPipe,
        PricePipe,
        SafeHtmlCustomPipe,
        SortPipe,
        RoleModifyPipe,
        NumberMinDigitPipe,
        SlugToNormalPipe,
        OrderStatusPipe,
        FilterByIdPipe,
        FilterBrandsPipe,
        BrandSearchPipe,
        ProfilePicturePipe,
        UserSearchPipe,
        CartPricePipe,
        FilterSelectedPipe,
        FormatBytesPipe,
        ProductImagePipe
    ]
})
export class PipesModule { }

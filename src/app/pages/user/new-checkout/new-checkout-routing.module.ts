import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewCheckoutComponent } from './new-checkout.component';
import { NewCheckoutModule } from './new-checkout.module';

const routes: Routes = [
  {path: '', component: NewCheckoutComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewCheckoutRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewRegistrationComponent } from './new-registration.component';

const routes: Routes = [
  {path: '', component: NewRegistrationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewRegistrationRoutingModule { }

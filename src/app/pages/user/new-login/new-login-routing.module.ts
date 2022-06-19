import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewLoginComponent } from './new-login.component';

const routes: Routes = [
  {path: '', component: NewLoginComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewLoginRoutingModule { }

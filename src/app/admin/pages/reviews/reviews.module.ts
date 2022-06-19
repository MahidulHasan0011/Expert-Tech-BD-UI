import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';
import {ReviewsComponent} from './reviews.component';
import {ReplyReviewComponent} from './reply-review/reply-review.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from "../../../shared/shared.module";
import {MaterialModule} from "../../../material/material.module";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { PipesModule } from 'src/app/shared/pipes/pipes.module';


export const routes = [
  {path: '', component: ReviewsComponent, pathMatch: 'full'},
  {path: 'reply-review/:id', component: ReplyReviewComponent},
];

@NgModule({
  declarations: [
    ReviewsComponent,
    ReplyReviewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MaterialModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    PipesModule
  ]
})
export class ReviewsModule {
}

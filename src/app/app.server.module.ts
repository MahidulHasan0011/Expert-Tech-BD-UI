import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import {FlexLayoutServerModule} from '@angular/flex-layout/server';
import {NgxSsrCacheModule} from "@ngx-ssr/cache";

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    FlexLayoutServerModule,
    NgxSsrCacheModule.configLruCache({ maxAge: 10 * 60_000, maxSize: 50 }),
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TrackerComponent } from './tracker/tracker.component';
import { PackageService } from '../data/services/package.service';
import { DeliveryService } from '../data/services/delivery.service';
import { WebSocketService } from '../data/services/websocket.service';

@NgModule({
  declarations: [
    AppComponent,
    TrackerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    PackageService,
    DeliveryService,
    WebSocketService,
    provideHttpClient(withInterceptorsFromDi()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

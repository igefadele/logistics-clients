import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TrackerComponent } from './tracker/tracker.component';  // Add TrackerComponent
import { PackageService } from './services/package.service';     // Add PackageService
import { DeliveryService } from './services/delivery.service';   // Add DeliveryService
import { WebSocketService } from './services/websocket.service'; // Add WebSocketService

@NgModule({
  declarations: [
    AppComponent,
    TrackerComponent  // Declare TrackerComponent
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

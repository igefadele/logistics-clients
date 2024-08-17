/* import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
 */


import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // Import your routes configuration

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // Provide HttpClient
    provideRouter(routes) // Provide Router if needed
  ]
}).catch((err) => console.error(err));

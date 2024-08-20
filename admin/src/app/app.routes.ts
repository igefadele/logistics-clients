import { Routes } from '@angular/router';
import { PackageDetailComponent } from './package-detail/package-detail.component';
import { DeliveryDetailComponent } from './delivery-detail/delivery-detail.component';
import { CreatePackageComponent } from './create-package/create-package.component';
import { CreateDeliveryComponent } from './create-delivery/create-delivery.component';
import { EditPackageComponent } from './edit-package/edit-package.component';
import { EditDeliveryComponent } from './edit-delivery/edit-delivery.component';
import { TrackerComponent } from './tracker/tracker.component';

export const routes: Routes = [
  { path: '', component: TrackerComponent },
  { path: 'package-detail/:id', component: PackageDetailComponent },
  { path: 'delivery-detail/:id', component: DeliveryDetailComponent },
  { path: 'create-package', component: CreatePackageComponent },
  { path: 'create-delivery', component: CreateDeliveryComponent },
  { path: 'edit-package/:id', component: EditPackageComponent },
  { path: 'edit-delivery/:id', component: EditDeliveryComponent },
  { path: '**',   redirectTo: ''},
];

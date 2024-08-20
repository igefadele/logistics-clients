import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPackage } from '../../data/models/package.model';
import { IDelivery } from '../../data/models/delivery.model';
import { formatLocation } from '../../core/utils';
import { OK, ROUTE_EDIT_DELIVERY } from '../../core/constants';
import { DeliveryService } from '../../data/services/delivery.service';
import { LocationService } from '../../data/services/location.service';
import { PackageService } from '../../data/services/package.service';
import { WebSocketService } from '../../data/services/websocket.service';
import { CommonModule } from '@angular/common';
import { DatastoreService } from '../../data/services/datastore.service';

@Component({
  selector: 'app-delivery-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delivery-detail.component.html',
  styleUrl: './delivery-detail.component.css'
})
export class DeliveryDetailComponent implements OnInit {
  deliveryId: string = '';
  packageId: string = '';
  deliveryDetails?: IDelivery | null;
  errorMessage: string = '';
  successMessage: string = '';
  formatLocation = formatLocation;

  constructor(
    private router: Router,
    private deliveryService: DeliveryService,
    private datastoreService: DatastoreService,
  ) {}

  ngOnInit(): void {
   // Subscribe to the selectedDelivery$ observable from DatastoreService
   this.datastoreService.selectedDelivery$
   .subscribe((deliveryDetails: IDelivery | null) => {
   this.deliveryDetails = deliveryDetails;
 });
  }

   /** ==== VIEW EDIT DELIVERY ROUTE: */
   viewEditDelivery() {
    this.router.navigate([ROUTE_EDIT_DELIVERY]);
  }

  /** ==== UPDATE DELIVERY:
  * Update a delivery document on the server */

  updateDelivery() {
    this.errorMessage = '';
    if (!this.deliveryDetails) {
      this.errorMessage = 'No new delivery data provided';
      return;
    }

    this.deliveryService.update(this.deliveryDetails)
      .subscribe((response) => {
        if (response.code === OK) {
          this.successMessage = response.message as string;
        } else {
          this.errorMessage = response.message as string;
      }
    });
  }

  /** ==== DELETE DELIVERY:
  * Delete a delivery document on the server */

  deleteDelivery() {
    this.errorMessage = '';
    if (!this.deliveryId) {
      this.errorMessage = 'No delivery ID provided';
      return;
    }

    this.deliveryService.delete(this.deliveryId)
      .subscribe((response) => {
        if (response.code === OK) {
          this.successMessage = response.message as string;
        } else {
          this.errorMessage = response.message as string;
      }
    });
  }


}

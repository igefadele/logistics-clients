import { Component } from '@angular/core';
import { formatLocation } from '../../core/utils';
import { IDelivery } from '../../data/models/delivery.model';
import { DeliveryService } from '../../data/services/delivery.service';
import { v4 as uuidv4 } from 'uuid';
import { OK } from '../../core/constants';
import { IPackage } from '../../data/models/package.model';
import { FormsModule } from '@angular/forms';
import { ILocation } from '../../data/models/location.model';
import { DeliveryStatus } from '../../data/enums';
import { CommonModule } from '@angular/common';
import { PackageService } from '../../data/services/package.service';

@Component({
  selector: 'app-create-delivery',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-delivery.component.html',
  styleUrl: './create-delivery.component.css'
})
export class CreateDeliveryComponent {
  packageId: string = '';
  deliveryDetails?: IDelivery;
  packageDetails?: IPackage;
  errorMessage: string = '';
  successMessage: string = '';
  formatLocation = formatLocation;
  currentTime = new Date();

  currentLocation: ILocation = <ILocation>{};
  deliveryStatusList = Object.values(DeliveryStatus);
  packageList: IPackage[] = [];
  deliveryList: IDelivery[] = [];

  newDeliveryData: IDelivery = {
    start_time: this.currentTime,
    pickup_time: this.currentTime,
    end_time: this.currentTime,
    location: this.currentLocation,
  } as IDelivery;

  constructor(
    private deliveryService: DeliveryService,
    private packageService: PackageService,
  ) { }

  ngOnInit(): void {
    this.newDeliveryData.status = DeliveryStatus.open;

    this.deliveryService.getAll()
      .subscribe((response) => {
        if (response.data) {
          this.deliveryList = response.data as IDelivery[];
        } else {
          console.log('No delivery list found');
        }
      });

    this.packageService.getAll()
      .subscribe((response) => {
        if (response.data) {
          this.packageList = response.data as IPackage[];
        } else {
          console.log('No package list found');
        }
      })
  }

  selectPackage(id: string) {
    if (!this.newDeliveryData) {
      this.errorMessage = 'No new package data provided';
      console.log(this.errorMessage);
      return;
    }
    this.newDeliveryData.package_id = id;
    console.log('active_delivery_id: ', id);
  }

  /** ==== CREATE DELIVERY:
  * Create new delivery document on the server */

  createDelivery() {
    this.errorMessage = '';
    if (!this.newDeliveryData) {
      this.errorMessage = 'No new delivery data provided';
      return;
    }
    const newDeliveryId = uuidv4();
    this.newDeliveryData.delivery_id = newDeliveryId;
    this.newDeliveryData.location = this.currentLocation;


    this.deliveryService.create(this.newDeliveryData)
      .subscribe((response) => {
        if (response.code === OK) {
          this.successMessage = response.message as string;
          console.log('successMessage: ', this.successMessage);
        } else {
          this.errorMessage = response.message as string;
          console.log('errorMessage: ', this.errorMessage);
      }
    });
  }


}

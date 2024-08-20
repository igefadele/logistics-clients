import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { DatastoreService } from '../../data/services/datastore.service';

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
  newDeliveryData: IDelivery = {} as IDelivery;

  currentLocation: ILocation = <ILocation>{};
  deliveryStatusList = Object.values(DeliveryStatus);
  packageList: IPackage[] = [];
  deliveryList: IDelivery[] = [];

  @ViewChild('packageModal') packageModal: any;
  @ViewChild('deliveryModal') deliveryModal: any;

  constructor(
    private modalService: NgbModal,
    private deliveryService: DeliveryService,
    private datastoreService: DatastoreService,
  ) { }

  ngOnInit(): void {
    this.datastoreService.packageList$
      .subscribe((list: IPackage[] | null) => {
        if (list) {
          this.packageList = list;
        } else {
          console.log('No package list found');
        }
      })

      this.datastoreService.deliveryList$
      .subscribe((list: IDelivery[] | null) => {
        if (list) {
          this.deliveryList = list;
        } else {
          console.log('No delivery list found');
        }
      })
  }

  openPackageModal() {
    this.modalService.open(this.packageModal);
  }

  openDeliveryModal() {
    this.modalService.open(this.deliveryModal);
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

    this.deliveryService.create(this.newDeliveryData)
      .subscribe((response) => {
        if (response.code === OK) {
          this.successMessage = response.message as string;
        } else {
          this.errorMessage = response.message as string;
      }
      });
  }


}

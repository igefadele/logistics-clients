/*
=================
DATASTORE SERVICE
*/

import { Injectable } from '@angular/core';
import { IPackage } from '../models/package.model';
import { IDelivery } from '../models/delivery.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseEntityType } from '../models/base_entity.model';
import { EntityKey, SavedDataKey } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class DatastoreService {
  private selectedPackage?: IPackage | null ;
  private selectedDelivery?: IDelivery | null;

  private packageList?: IPackage[] | null ;
  private deliveryList?: IDelivery[] | null;

  private selectedPackageSubject = new BehaviorSubject<IPackage | null>(null);
  selectedPackage$: Observable<IPackage | null> = this.selectedPackageSubject.asObservable();

  private selectedDeliverySubject = new BehaviorSubject<IDelivery | null>(null);
  selectedDelivery$: Observable<IDelivery | null> = this.selectedDeliverySubject.asObservable();

  private packageListSubject = new BehaviorSubject<IPackage[] | null>(null);
  packageList$: Observable<IPackage[] | null> = this.packageListSubject.asObservable();

  private deliveryListSubject = new BehaviorSubject<IDelivery[] | null>(null);
  deliveryList$: Observable<IDelivery[] | null> = this.deliveryListSubject.asObservable();


  /** ==== SET OBSERVABLE DATA:
  * Set an observable data which can be subscribed to in any component */
    setObsData(key: SavedDataKey, data: any): void {
      switch (key) {
        case SavedDataKey.package:
          this.selectedPackageSubject.next(data);
          break;
        case SavedDataKey.delivery:
          this.selectedDeliverySubject.next(data);
          break;
        case SavedDataKey.packageList:
          this.packageListSubject.next(data);
          break;
        case SavedDataKey.deliveryList:
          this.deliveryListSubject.next(data);
          break;
        default:
          throw new Error (`Provided ${key} don't match any entity key`)
      }
    }

  /** ==== GET OBSERVABLE DATA (BUT ONCE)
  * Get obsservanble data once and not the updated version of the said data  */
  getObsData(key: SavedDataKey): any {
    switch (key) {
      case SavedDataKey.package:
        return this.selectedPackageSubject.getValue();
      case SavedDataKey.delivery:
        return this.selectedDeliverySubject.getValue();
      case SavedDataKey.packageList:
        return this.packageListSubject.getValue();
      case SavedDataKey.deliveryList:
        return this.deliveryListSubject.getValue();
      default:
        throw new Error (`Provided ${key} don't match any entity key`)
    }
  }


  /** ==== SET DATA
  * Set a data to the provided value */
  setData(key: SavedDataKey, data: any): void {
    switch (key) {
      case SavedDataKey.package:
        this.selectedPackage = data;
        break;
      case SavedDataKey.delivery:
        this.selectedDelivery = data;
        break;
      case SavedDataKey.packageList:
        this.packageList = data;
        break;
      case SavedDataKey.deliveryList:
        this.deliveryList = data;
        break;
      default:
        throw new Error (`Provided ${key} don't match any entity key`)
    }
  }


  /** ==== GET DATA
  * get a data value  */
  getData(key: SavedDataKey): any {
    switch (key) {
      case SavedDataKey.package:
        return this.selectedPackage;
      case SavedDataKey.delivery:
        return this.selectedDelivery;
      case SavedDataKey.packageList:
        return this.packageList;
      case SavedDataKey.deliveryList:
        return this.deliveryList;
      default:
        throw new Error (`Provided ${key} don't match any entity key`)
    }
  }
}

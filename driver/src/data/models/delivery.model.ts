/*
===============
DELIVERY MODEL
===============
/// Data Model for the Delivery Entity
*/

import { DeliveryStatus } from "../enums";
import { ILocation } from "./location.model";

export interface IDelivery {
  delivery_id: string;
  package_id: string;
  pickup_time: Date; // timestamp
  start_time: Date;  //timestamp
  end_time: Date;  // timestamp
  location: ILocation;
  status: DeliveryStatus;
}

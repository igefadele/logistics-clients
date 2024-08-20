/*
==============
PACKAGE MODEL
==============
/// Data Model for the Package Entity
*/

import { ILocation } from "./location.model";

export interface IPackage extends Document {
  package_id: string;
  active_delivery_id?: string;
  description: string;
  weight: number; // grams (Integer)
  width: number; // cm (Integer)
  height: number; // cm (Integer)
  depth: number; // cm (Integer)
  from_name: string;
  from_address: string;
  from_location: ILocation;
  to_name: string;
  to_address: string;
  to_location: ILocation;
}


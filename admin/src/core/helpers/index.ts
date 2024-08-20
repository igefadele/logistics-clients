/*
==================
BASE HELPERS
*/


import { IDelivery } from "../models/delivery.model";
import { IPackage } from "../models/package.model";
import { EntityKey } from "../../data/enums";

interface BaseEntity extends Document {
  _id: string;
}

/** ==== GET MONGOOSE MODEL:
Get the Mongoose Model for the Entity which its enum key is provided */
/* export function getEntity(key: EntityKey): BaseEntity{
  switch (key) {
    case EntityKey.delivery:
      return IDelivery;
      break;
    case EntityKey.package:
      return IPackage;
      break;
    default:
      throw new Error(`====\n\ngetEntityModel Instance: Invalid EntityKey key: ${key}\n\n====`);
  }
} */

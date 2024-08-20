/*
=======
UTILITY FUNCTIONS
=======
*/

import { ILocation } from "../../data/models/location.model";

/** Function to check if any property of an object is empty or not provided */
export function hasEmptyFields(data: { [x: string]: any; }) {
  for (let key in data) {
      if (data[key] === '' || data[key] === null || data[key] === undefined) {
          return true;
      }
  }
  return false;
}

/** FUnction to convert a location object to readable string output */
export function formatLocation(location: ILocation): string {
  return `lat: ${location.lat}, lng: ${location.lng}`;
}

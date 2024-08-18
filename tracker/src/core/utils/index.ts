/*
=======
UTILITY FUNCTIONS
=======
*/

/** Function to check if any property of an object is empty or not provided */
export function hasEmptyFields(data: { [x: string]: any; }) {
  for (let key in data) {
      if (data[key] === '' || data[key] === null || data[key] === undefined) {
          return true;
      }
  }
  return false;
}

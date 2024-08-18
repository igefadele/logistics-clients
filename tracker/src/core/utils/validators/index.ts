/** ==== GUID/UUID VALIDATOR:
Validate whether a given string that's said to be GUID/UUID is truly a GUID/UUID string. */

export const validateGuid = (value: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}


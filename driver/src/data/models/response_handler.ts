/** 
==================
RESPONSE HANDLER MODEL
Custom class to provide structure for the Server responses so as to have a 
uniform response data structure expectation on the clients.
*/

export class ResponseHandler {
  statusCode!: number;
  data!: object;
  code?: string;
  message?: string;
  timestamp?: string;

  constructor(data: Partial<ResponseHandler>) {
    Object.assign(this, data);
  }
}

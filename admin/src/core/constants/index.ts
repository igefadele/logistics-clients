/**
 ==============
 CONSTANT VALUES
*/

export const PACKAGE = "package";
export const DELIVERY = "delivery";

// LOCAL
/* export const API_BASE_URL = "http://localhost:3000/api";
export const API_WS_BASE_URL = "http://localhost:3000";
export const TRACKER_BASE_URL = "http://localhost:4200"; */

// REMOTE
export const API_BASE_URL = "https://logistics-api-07i7.onrender.com/api";
export const API_WS_BASE_URL = "https://logistics-api-07i7.onrender.com";
export const TRACKER_BASE_URL = " https://logistics-admin.onrender.com";


export const POST = "POST";
export const GET = "GET";
export const PUT = "PUT";
export const PATCH = "PATCH";
export const DELETE = "DELETE";

export const OK = "OK";
export const SUCCESS = "SUCCESS";
export const ERROR = "ERROR";
export const INTERNAL_SERVER_ERROR = "Internal Server Error";

export const DOC_NOT_FOUND = "Document not found or does not exist";
export const DOC_CREATED = "Document is created and added to database collection";
export const DOC_DELETED = "Document is deleted from the database collection";
export const DOC_UPDATED = "Document is updated in the database collection";
export const ID_NOT_MATCH = "The document specified ID does not match the actual document ID to be updated";

export const CONNECTION = "connection";
export const DISCONNECT = "disconnect";
export const MESSAGE = "message";
export const SOCKETIO_CONNECTED = "SocketIO connection from a client is established";
export const SOCKETIO_DISCONNECTED = "SocketIO connection disconnected";

export const DELIVERY_ID = "delivery_id";
export const PACKAGE_ID = "package_id";

export const UNKNOWN_INCOMING_WS_EVENT_TYPE = "Received an unknown incoming event";
export const UNHANDLED_WS_EVENT_TYPE = "Unhandled Websocket Event Type";

export const FROM_LOCATION = "from_location";
export const TO_LOCATION = "to_location";
export const CURRENT_LOCATION = "current_location";
export const FROM_LOCATION_TITLE = "From Location";
export const TO_LOCATION_TITLE = "To Location";
export const CURRENT_LOCATION_TITLE = "Current Location";
export const MAP = 'map';

export const ROUTE_HOME = '/'
export const ROUTE_PACKAGE_DETAIL = '/package-detail'
export const ROUTE_DELIVERY_DETAIL = '/delivery-detail';
export const ROUTE_CREATE_PACKAGE = '/create-package';
export const ROUTE_CREATE_DELIVERY = '/create-delivery';
export const ROUTE_EDIT_PACKAGE = '/edit-package';
export const ROUTE_EDIT_DELIVERY = '/edit-delivery';

const PROTOCOL = "http";

// const SERVER_IP = "18.188.236.142";
const PORT = "4000";

const SERVER_IP = "localhost";
// const PORT = '8080';

export const SERVER_PATH = `${PROTOCOL}://${SERVER_IP}:${PORT}`;

export const ROOT_URL = `${SERVER_PATH}/api`;

// ====================================================================================================

export const PRODUCT_TYPES = `${ROOT_URL}/product-types`;
export const PRODUCTS_WITH_TYPE_ID = `${ROOT_URL}/products-with-type-id`;
export const NEW_ORDER = `${ROOT_URL}/new-order`;
export const ALL_ORDERS = `${ROOT_URL}/all-orders`;
export const ADD_ORDER_PAYMENT = `${ROOT_URL}/add-order-payment`;
export const UPDATE_DELIVERY_DATE = `${ROOT_URL}/update-date`;
export const ADD_NEW_EMPLOYEE = `${ROOT_URL}/add-employee`;
export const GET_ALL_EMPLOYEES = `${ROOT_URL}/all-employees`;
export const GET_ALL_VEHICLE_NUMBERS = `${ROOT_URL}/get-vehicle-list`;
export const GET_EXPENSES = `${ROOT_URL}/get-expenses`;
export const GET_ORDER_DETAIL = `${ROOT_URL}/order-detail`;
export const GENERATE_RECEIPT = `${ROOT_URL}/generate-pdf`;
export const CANCEL_ORDER = `${ROOT_URL}/cancel-order`;
export const EMPLOYEE_TOTALS = `${ROOT_URL}/employee-totals`;
export const GENERATE_CASH_REPORT = `${ROOT_URL}/generate-cash-report-pdf`;
export const USER_BASE_URL = `${ROOT_URL}/accounts/user`;
export const CHANGE_PASSWORD = `${ROOT_URL}/change-password`;
export const SET_VAT = `${ROOT_URL}/set-vat`;
export const GET_VAT = `${ROOT_URL}/get-vat`;
export const SET_STARTING_ORDER_NUMBER = `${ROOT_URL}/set-starting-order-number`;
export const GET_STARTING_ORDER_NUMBER = `${ROOT_URL}/get-starting-order-number`;
export const ADD_EXPENSE = `${ROOT_URL}/add-expense`;

export const AUTH_BASE_URL = `${SERVER_PATH}/auth`;
export const USER_AUTHENITCATION = `${AUTH_BASE_URL}/signin`;

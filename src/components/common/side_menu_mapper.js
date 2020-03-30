import {
  LOAD_APP,
  EMPLOYEES_BASE_URL,
  ADD_EMPLOYEE,
  RESET_EMPLOYEE_PASSWORD,
  NEW_ORDER,
  ALL_ORDERS
} from "../router/routeConstants";

export var naver = {
  [LOAD_APP]: {
    "/": {
      id: "M_LOAD_APP",
      name: "Dashboard",
      url: LOAD_APP,
      fa_icon: ["fas", "home"]
    },
    fa_icon: ["fas", "home"]
  },
  [NEW_ORDER]: {
    "/": {
      id: "NEW_ORDER",
      name: "New Job Order",
      url: NEW_ORDER,
      fa_icon: ["fas", "cart-plus"]
    },
    fa_icon: ["fas", "cart-plus"]
  },
  [ALL_ORDERS]: {
    "/": {
      id: "ALL_ORDERS",
      name: "All Orders",
      url: ALL_ORDERS,
      fa_icon: ["fas", "search"]
    },
    fa_icon: ["fas", "search"]
  },
  [ADD_EMPLOYEE]: {
    "/": {
      id: "M_ADD_EMPLOYEE",
      name: "Add Employee",
      url: ADD_EMPLOYEE,
      fa_icon: ["fas", "cart-plus"]
    },
    fa_icon: ["fas", "search"]
  },
  [EMPLOYEES_BASE_URL]: {
    "/": {
      id: "M_EMPLOYEES_BASE_URL",
      name: "View Employees",
      url: EMPLOYEES_BASE_URL,
      fa_icon: ["fas", "cart-plus"]
    },
    "/add-employee": {
      id: "M_ADD_EMPLOYEE",
      name: "Add Employee",
      url: ADD_EMPLOYEE,
      fa_icon: ["fas", "cart-plus"]
    },
    "/employee-password-reset": {
      id: "M_RESET_EMPLOYEE_PASSWORD",
      name: "Reset Employee Password",
      url: RESET_EMPLOYEE_PASSWORD,
      fa_icon: ["fas", "cart-plus"]
    },
    fa_icon: ["fas", "cart-plus"]
  }
};

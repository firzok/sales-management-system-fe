import {
  LOAD_APP,
  ADD_EMPLOYEE,
  NEW_ORDER,
  ALL_ORDERS,
  SETTINGS,
  EXPENSES,
} from "../router/routeConstants";

export var naver = {
  [LOAD_APP]: {
    "/": {
      id: "M_LOAD_APP",
      name: "Dashboard",
      url: LOAD_APP,
      fa_icon: ["fas", "home"],
    },
    fa_icon: ["fas", "home"],
  },
  [NEW_ORDER]: {
    "/": {
      id: "NEW_ORDER",
      name: "New Job Order",
      url: NEW_ORDER,
      fa_icon: ["fas", "cart-plus"],
    },
    fa_icon: ["fas", "cart-plus"],
  },
  [EXPENSES]: {
    "/": {
      id: "M_LOAD_APP",
      name: "Expenses",
      url: EXPENSES,
      fa_icon: ["fas", "money-bill-wave"],
    },
    fa_icon: ["fas", "money-bill-wave"],
  },
  [ALL_ORDERS]: {
    "/": {
      id: "ALL_ORDERS",
      name: "All Orders",
      url: ALL_ORDERS,
      fa_icon: ["fas", "search"],
    },
    fa_icon: ["fas", "search"],
  },
  [ADD_EMPLOYEE]: {
    "/": {
      id: "M_ADD_EMPLOYEE",
      name: "Add Employee",
      url: ADD_EMPLOYEE,
      fa_icon: ["fas", "user-plus"],
    },
    fa_icon: ["fas", "user-plus"],
  },
  [SETTINGS]: {
    "/": {
      id: "M_SETTINGS",
      name: "Settings",
      url: SETTINGS,
      fa_icon: ["fas", "cogs"],
    },
    fa_icon: ["fas", "cogs"],
  },
};

import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import ProtectedRoute from "./protectedRoute";

import {
  LOAD_LOGIN,
  LOAD_LOGOUT,
  CHANGE_PASSWORD,
  LOAD_APP,
  NEW_ORDER,
  ALL_ORDERS,
  ADD_EMPLOYEE,
  ORDER,
  SETTINGS,
  EXPENSES,
} from "./routeConstants";

import Login from "../authentication/login";
import Logout from "../authentication/logout";
import ChangePassword from "../settings/change_password";
import App from "../../App";
import NewOrder from "../order/newOrder";
import AllOrders from "../order/allOrder";
import AddEmployee from "../employees/add_employee";
import Order from "../order/order";
import Settings from "../settings/settings";
import Expenses from "../expense/expenses";

class AllRoutes extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <ProtectedRoute path={LOAD_LOGIN} component={Login} />
          <ProtectedRoute exact path={LOAD_LOGOUT} component={Logout} />
          <ProtectedRoute
            exact
            path={CHANGE_PASSWORD}
            component={ChangePassword}
          />
          <ProtectedRoute exact path={LOAD_APP} component={App} />
          <ProtectedRoute exact path={SETTINGS} component={Settings} />
          <ProtectedRoute exact path={EXPENSES} component={Expenses} />
          <ProtectedRoute exact path={NEW_ORDER} component={NewOrder} />
          <ProtectedRoute exact path={ALL_ORDERS} component={AllOrders} />
          <ProtectedRoute exact path={ORDER} component={Order} />
          <ProtectedRoute exact path={ADD_EMPLOYEE} component={AddEmployee} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default AllRoutes;

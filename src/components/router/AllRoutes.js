import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import ProtectedRoute from './protectedRoute';

import {
    LOAD_LOGIN, LOAD_LOGOUT, CHANGE_PASSWORD, VIEW_PROFILE, LOAD_APP, NEW_ORDER
} from './routeConstants';

import Login from '../authentication/login';
import Logout from '../authentication/logout';
import ChangePassword from '../settings/change_password';
import ViewEmployeeProfile from '../employees/view_employee_profile';
import App from '../../App';
import NewOrder from '../order/newOrder';


class AllRoutes extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <ProtectedRoute path={ LOAD_LOGIN } component={ Login } />
                    <ProtectedRoute exact path={ LOAD_LOGOUT } component={ Logout } />
                    <ProtectedRoute exact path={ CHANGE_PASSWORD } component={ ChangePassword } />
                    <ProtectedRoute exact path={ VIEW_PROFILE } component={ ViewEmployeeProfile } />
                    <ProtectedRoute exact path={ LOAD_APP } component={ App } />
                    <ProtectedRoute exact path={ NEW_ORDER } component={ NewOrder } />


                </Switch>
            </BrowserRouter>
        )
    }
}


export default AllRoutes;
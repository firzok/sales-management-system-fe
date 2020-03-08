import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import _ from "lodash"

import { ERROR_404, LOAD_LOGIN } from './routeConstants';
import { GetPath, isValidJSON } from '../../assets/js/helper'

import { connect } from "react-redux";
import { fetchUser } from '../../actions';
import localPermissions, { defaultPermissionsList } from '../../config/static_lists';
// import CustomLoader from '../common/loader';

class ProtectedRoute extends Component {

    constructor(props) {
        super(props);
        this.state = {
            validToken: false
        }

        this.isAuthorizedRoute = this.isAuthorizedRoute.bind(this);
        this.CheckForToken = this.isUserLoggedIn.bind(this);
    }

    UNSAFE_componentWillMount() {
        if (_.isEmpty(this.props.activeUser.user)) {
            if (isValidJSON(sessionStorage.getItem('user'))) {
                var user = JSON.parse(sessionStorage.getItem('user'));
                if (user && typeof (user) !== 'string') {
                    if ("empID") {
                        this.props.fetchUser(user);
                    }
                }
            }
        }
    }

    /**
     * check the current routing url against authorized urls of users
     */
    isAuthorizedRoute() {
        var path = GetPath(this.props.path);
        var user_permission = [];
        user_permission = localPermissions;
        if (this.props.activeUser.user['permissions']) {
            user_permission = this.props.activeUser.user['permissions']
        }
        // var user_permission = [...this.state.permission];
        var idx = user_permission.indexOf(path);

        if (path == "*")
            return true;

        return (idx >= 0);
    }

    isLoginPath() {
        var path = GetPath(this.props.path);
        if (path == "/auth/login") {
            return true;
        }
        return false;
    }

    checkFor404() {
        var path = GetPath(this.props.path);
        return path == '/error404'
    }

    /**
     * check that user is logged in or not
     */
    isUserLoggedIn() {
        if (isValidJSON(sessionStorage.getItem('user'))) {
            var user = JSON.parse(sessionStorage.getItem('user'));
            if (user && typeof (user) !== 'string') {
                if ("empID" in user && "jwt_token" in user) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Main render Function
     * ------------------------------
     * 
     */
    render() {
        const { component: Component, ...props } = this.props;
        var __html = ""
        // var __html = <div className="d-flex justify-content-center align-items-center loading-main">
        //     <CustomLoader width={ 200 } height={ 200 } customstyles={ {} } />
        // </div>
        /* if user is logged in */
        if (this.isUserLoggedIn()) {

            /* first fetch the user details from server */
            if (!_.isEmpty(this.props.activeUser.user)) {
                if ('message' in this.props.activeUser.user) {
                    sessionStorage.removeItem('user');
                    __html =
                        <Route
                            { ...props }
                            render={ props => <Redirect to={ LOAD_LOGIN } /> }
                        />
                }

                else if (this.isLoginPath()) {
                    __html =
                        <Route
                            { ...props }
                            render={ props => <Redirect to={ "/" } /> }
                        />
                }

                else if (this.isAuthorizedRoute()) {
                    __html =
                        <Route
                            { ...props }
                            render={ props => <Component { ...props } /> }
                        />
                }
                else {
                    __html =
                        <Route
                            { ...props }
                            render={ props => <Redirect to={ ERROR_404 } /> }
                        />
                }
            }
        }
        else {
            sessionStorage.removeItem('user');
            if (this.isLoginPath()) {
                __html =
                    <Route
                        { ...props }
                        render={ props => <Component { ...props } /> }
                    />
            }
            else {
                __html =
                    <Route
                        { ...props }
                        render={ props => <Redirect to={ LOAD_LOGIN } /> }
                    />
            }
        }

        return __html;
    }
}

function mapStateToProps({ activeUser }) {
    return { activeUser }
}

export default connect(mapStateToProps, { fetchUser })(ProtectedRoute);
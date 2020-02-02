import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import _ from "lodash"

import { ERROR_404, LOAD_LOGIN } from './routeConstants';
import { GetPath, isValidJSON } from '../../assets/js/helper'

import { connect } from "react-redux";
import { fetchUser, getLeaveTypes } from '../../actions';
// import CustomLoader from '../common/loader';

class ProtectedRoute extends Component {

    constructor(props) {
        super(props);
        this.state = {
            validToken: false
        }

        this.isAuthorizedRoute = this.isAuthorizedRoute.bind(this);
        this.CheckForToken = this.CheckForToken.bind(this);
    }

    UNSAFE_componentWillMount() {
        if (_.isEmpty(this.props.activeUser)) {
            if (isValidJSON(localStorage.getItem('user'))) {
                var user = JSON.parse(localStorage.getItem('user'));
                if (user && typeof (user) !== 'string') {
                    if ("empID") {
                        this.props.fetchUser(user['empID']);
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
        if (this.props.activeUser['permissions']) {
            user_permission = this.props.activeUser['permissions'].split(",");
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
    CheckForToken() {
        if (isValidJSON(localStorage.getItem('user'))) {
            var user = JSON.parse(localStorage.getItem('user'));
            if (user && typeof (user) !== 'string') {
                if ("empID" in user && "access_token" in user) {
                    this.props.getLeaveTypes();
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
        if (this.CheckForToken()) {

            /* first fetch the user details from server */
            if (!_.isEmpty(this.props.activeUser)) {
                if ('message' in this.props.activeUser) {
                    localStorage.removeItem('user');
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
            localStorage.removeItem('user');
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

export default connect(mapStateToProps, { fetchUser, getLeaveTypes })(ProtectedRoute);
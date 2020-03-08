import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Card from '../common/card';
// import LeaveCard from './leave_card';
import { VIEW_LEAVE_HISTORY, EMPLOYEES_BASE_URL } from '../router/routeConstants';
import { deepCompare, formatNumber } from '../../assets/js/helper';
import { Notifications } from '../common/notification';
import Select from 'react-select';
import { LeaveStatusWithAll } from '../../config/static_lists';

class DashboardAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            leaves: null,
            totalLeaves: "...",
            totalStrength: "...",
            totalEmployees: "...",
            totalApproved: "...",
            totalNotApproved: "...",
            totalPending: "...",
            updateCalendarData: false,
            loadEmployees: true,
            leaveStatus: { value: "pending", label: "Pending", render: true },
        }

        this.makeRedirection = this.makeRedirection.bind(this);
        this.makeRedirectionToEmployee = this.makeRedirectionToEmployee.bind(this);
    }

    componentDidMount() {
        this.timeout = setInterval(() => {
            this.setState({ loadEmployees: false });
            this.getDashboardData();
        }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.timeout);
    }

    makeRedirection(__label, __status) {
        var __leaveStatus = null
        if (__label && __status) {
            __leaveStatus = { label: __label, render: true, value: __status }
            if (__status.toLowerCase() === "pending" || __status.toLowerCase() === "notapproved") {
                this.props.history.push({
                    pathname: VIEW_LEAVE_HISTORY,
                    isSelectedLeave: true,
                    selectedLeaveStatus: __leaveStatus,
                    appliedDateFilter: new Date(),
                });
            }
            else {
                this.props.history.push({
                    pathname: VIEW_LEAVE_HISTORY,
                    isSelectedLeave: true,
                    selectedLeaveStatus: __leaveStatus,
                    startDateFilter: new Date(),
                    endDateFilter: new Date(),
                });
            }
        }
        else {
            this.props.history.push({
                pathname: VIEW_LEAVE_HISTORY,
                isSelectedLeave: true,
                selectedLeaveStatus: __leaveStatus,
                appliedDateFilter: new Date(),
            });
        }
    }

    makeRedirectionToEmployee() {
        this.props.history.push({
            pathname: EMPLOYEES_BASE_URL,
        });
    }

    toggleCalendarUpdate() {
        this.setState({ updateCalendarData: !this.state.updateCalendarData });
    }

    checkNoData(data, status) {
        var noData = true;
        for (var key in data) {
            for (var i = 0; i < data[key].length; i++) {
                if (data[key][i]["leaveRecord"].status === status) {
                    noData = false;
                    return noData;
                }
            }
        }
        return noData;
    }

    getLeaveRecordsSections() {
        var data = this.state.data;
        var leaves = this.state.leaves;

        const keys = Object.keys(data);
        if (keys.length > 0) {
            const status = this.state.leaveStatus.value;
            var noData = false;
            if (status !== "all") {
                noData = this.checkNoData(data, status);
            }

            if (!noData) {
                return Object.keys(data).map((key, idx) => {
                    if (status === "all") {
                        return (
                            <Fragment key={ idx }>
                                <legend className="text-uppercase font-size-sm font-weight-bold">{ leaves[Number(key)]["name"] }</legend>
                                <div className="row">
                                    { this.getLeaveRecords(data[key]) }
                                </div>
                            </Fragment>
                        )
                    }
                    else if (!(this.checkNoData({ key: data[key] }, status))) {
                        return (
                            <Fragment key={ idx }>
                                <legend className="text-uppercase font-size-sm font-weight-bold">{ leaves[Number(key)]["name"] }</legend>
                                <div className="row">
                                    { this.getLeaveRecords(data[key]) }
                                </div>
                            </Fragment>
                        )
                    }
                })
            }
            else {
                return (
                    <div className="alert alert-info alert-styled-left alert-arrow-left">
                        No records found.
					</div>
                )
            }
        }
        else {
            return (
                <div className="alert alert-info alert-styled-left alert-arrow-left">
                    No records found.
				</div>
            )
        }
    }

    onSelect(name, selected) {
        this.setState({ [name]: selected });
    }

    render() {
        return (
            <Fragment>
                {/* <div className="col-md-6 col-xl-4">
                <div className="row">
                        <div className="card card-body">
                            <div className="media">
                                <div className="mr-3 align-self-center">
                                    <i className="fas fa-users font-s-48 text-primary"></i>
                                </div>

                                <div className="media-body text-right">
                                    <h3 className="font-weight-semibold mb-0">{ formatNumber(this.state.totalEmployees) }</h3>
                                    <span className="text-uppercase font-size-sm text-muted">Total Active Employees</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-xl-4 cursor-pointer" onClick={ this.makeRedirectionToEmployee.bind(this) }>
                        <div className="card card-body">
                            <div className="media">
                                <div className="mr-3 align-self-center">
                                    <i className="fas fa-user-friends font-s-48 text-pink-400"></i>
                                </div>

                                <div className="media-body text-right">
                                    <h3 className="font-weight-semibold mb-0">{ this.state.totalStrength }</h3>
                                    <span className="text-uppercase font-size-sm text-muted">Your Team</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-xl-4 cursor-pointer" onClick={ this.makeRedirection.bind(this, null, null) }>
                        <div className="card card-body cursor-pointer">
                            <div className="media">
                                <div className="mr-3 align-self-center">
                                    <i className="fas fa-running fa-flip-horizontal font-s-48 text-orange"></i>
                                </div>
                                <div className="media-body text-right">
                                    <h3 className="font-weight-semibold mb-0">{ this.state.totalLeaves }</h3>
                                    <span className="text-uppercase font-size-sm text-muted">Leaves Applied Today</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-xl-4 cursor-pointer" onClick={ this.makeRedirection.bind(this, "Approved", "approved") }>
                        <div className="card card-body bg-success-400 has-bg-image">
                            <div className="media">
                                <div className="media-body">
                                    <h3 className="mb-0">{ this.state.totalApproved }</h3>
                                    <span className="text-uppercase font-size-xs">Approved Leaves</span>
                                </div>

                                <div className="ml-3 align-self-center">
                                    <i className="fas fa-check font-s-48 opacity-75"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-xl-4 cursor-pointer" onClick={ this.makeRedirection.bind(this, "Pending", "pending") }>
                        <div className="card card-body bg-indigo-400 has-bg-image">
                            <div className="media">
                                <div className="media-body">
                                    <h3 className="mb-0">{ formatNumber(this.state.totalPending) }</h3>
                                    <span className="text-uppercase font-size-xs">Today's Pending Leaves</span>
                                </div>

                                <div className="ml-3 align-self-center">
                                    <i className="fas fa-spinner font-s-48 opacity-75"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-xl-4 cursor-pointer" onClick={ this.makeRedirection.bind(this, "Rejected", "notapproved") }>
                        <div className="card card-body bg-danger-400 has-bg-image">
                            <div className="media">
                                <div className="media-body">
                                    <h3 className="mb-0">{ this.state.totalNotApproved }</h3>
                                    <span className="text-uppercase font-size-xs">Today's Rejected Leaves</span>
                                </div>

                                <div className="ml-3 align-self-center">
                                    <i className="fas fa-times font-s-48 opacity-75"></i>
                                </div>
                            </div>
                        </div>
                </div>
                    </div> */}
            </Fragment>
        );
    }

}

function mapStateToProps({ activeUser }) {
    return { activeUser }
}

export default withRouter(connect(mapStateToProps)(DashboardAdmin));
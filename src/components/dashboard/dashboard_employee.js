import React, { Component, Fragment } from 'react';
import axios from 'axios';
import CustomLoader from '../common/loader';
import Pagination from "react-js-pagination";
import Card from '../common/card';
import { pages, monthsObject } from '../../config/static_lists';
import Select from 'react-select';
import { makeListFromObj } from '../../actions';
// import { Bar } from 'react-chartjs-2';
import { connect } from "react-redux";
import { deepCompare } from '../../assets/js/helper';

var moment = window.moment;
var TopColors = window.TopColors;

const plugin = {
    datalabels: {
        align: function (context) {
            var index = context.dataIndex;
            var value = context.dataset.data[index];
            return value < 1 ? 'end' : 'start'
        },
        display: function (context) {
            return context.dataset.data[context.dataIndex] !== 0; // or >= 1 or ...
        },
        backgroundColor: null,
        borderColor: null,
        borderRadius: 4,
        borderWidth: 1,
        color: 'black',
        font: {
            size: 12,
            weight: 500
        },
        offset: 5,
        padding: 0
    }
}

class DashboardEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leavesBalance: null,
            leavesPending: null,
            leavesTotal: null,
            lastLeaveRecord: null,
            leaveTypes: null,
            statsData: null,
            data: null,
            total: 0,
            skip: 0,
            size: 5,
            activePage: 1,
            leaveTypeList: [],
            leavesOptions: {},
            leavesHistoryData: {},
            yearOptions: [],
            selectedYear: new Date().getFullYear().toString(),
            colorsLeaveTypes: this.props.leaveTypes
        }

        this.onLimitChange = this.onLimitChange.bind(this);
        this.getLogsData = this.getLogsData.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleYearChange = this.handleYearChange.bind(this);
    }

    makeYearOptions() {
        var yearOptions = [];
        for (var i = new Date().getFullYear(); i >= 2015; i--) {
            yearOptions.push({ value: i.toString(), label: i.toString() });
        }

        this.setState({ yearOptions });
    }

    UNSAFE_componentWillMount() {
        this.getStatsData();
        if (this.props.showLeaveHistory) {
            this.getLogsData();
        }
        if (this.props.showLeaveHistoryGraph) {
            this.makeYearOptions();
            this.setOptions();
            this.getChartsData();
        }
    }

    setOptions() {
        var leavesOptions = {
            title: {
                display: false,
            },
            plugins: plugin,
            tooltips: {
                intersect: false,
                mode: 'nearest',
                label: 'mylabel',
            },
            legend: {
                display: true,
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    stacked: false,
                    display: true,
                    gridLines: {
                        display: true
                    },
                    scaleLabel: {
                        display: true,
                    },
                    ticks: {
                        padding: 10,
                        fontSize: 14,
                        maxRotation: 90
                    }
                }],
                yAxes: [{
                    stacked: false,
                    display: true,
                    gridLines: {
                        display: false
                    },
                    scaleLabel: {
                        display: true,
                    },
                    ticks: {
                        padding: 10,
                        beginAtZero: true,
                    }
                }]
            },
            elements: {
                line: {
                    tension: 0.0000001
                },
                point: {
                    radius: 4,
                    borderWidth: 12
                }
            },

            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            }
        }
        this.setState({ leavesOptions });
    }

    onLimitChange(selected) {
        const skip = 0;
        const size = Number(selected.value);
        this.setState({ activePage: 1, skip, size }, () => { this.getLogsData() });
    }

    getPascalCase(text) {
        var result = text.replace(/([A-Z])/g, " $1");
        var pascalText = result.charAt(0).toUpperCase() + result.slice(1);
        return pascalText;
    }

    makeChartData(responseData, color = null) {
        var chartData = {};

        var labels = [];
        var data = {};
        var datasets = [];

        for (var key in responseData) {
            labels.push(monthsObject[key]);
            var i = 0;
            for (var leaveType in responseData[key]) {
                if (!(leaveType in data)) {
                    var name = leaveType.toLowerCase().replace(/\s+/g, '');
                    data[leaveType] = {
                        label: this.getPascalCase(leaveType.trim()),
                        backgroundColor: this.state.colorsLeaveTypes[name],
                        data: []
                    };
                }
                data[leaveType].data.push(responseData[key][leaveType]);
                i++;
            }
        }

        for (var keyData in data) {
            datasets.push(data[keyData]);
        }

        chartData = {
            labels: labels,
            datasets: datasets
        }

        return chartData;
    }

    handlePageChange(pageNumber) {
        const skip = (pageNumber * this.state.size) - this.state.size;
        this.setState({ activePage: pageNumber, skip }, () => { this.getLogsData() });
    }

    handleYearChange(selected) {
        this.setState({ selectedYear: selected.value }, () => { this.getChartsData() });
    }

    makeStatsData(leaveTypes, leavesBalance, leavesTotal) {
        var statsData = {};

        if (leaveTypes) {
            Object.keys(leaveTypes).map(key => {
                var leaveType = leaveTypes[key];
                var leaveID = leaveType["id"];
                if (leaveID in leavesBalance) {
                    var leaveName = leaveType["name"].trim();
                    var exhausted = leavesTotal[leaveID] - leavesBalance[leaveID];
                    var percentage = isNaN((leavesBalance[leaveID] * 100) / leavesTotal[leaveID]) ? 0 : ((leavesBalance[leaveID] * 100) / leavesTotal[leaveID]).toFixed(2);
                    var total = leavesTotal[leaveID];
                    var balance = leavesBalance[leaveID];

                    statsData[leaveName] = { total, balance, exhausted, percentage }
                }
            });
        }

        return statsData;
    }

    renderStats() {
        var statsData = this.state.statsData;
        if (statsData !== null) {
            return Object.keys(statsData).map((key, idx) => {
                var percentage = Number(statsData[key]["percentage"]);
                var battery = "battery-full fa-rotate-90";
                var color = "danger";
                if (percentage >= 100) {
                    color = "success";
                    battery = "battery-full fa-rotate-270";
                }
                else if (percentage >= 80) {
                    color = "primary";
                    battery = "battery-three-quarters fa-rotate-270";
                }
                else if (percentage >= 60) {
                    color = "info";
                    battery = "battery-half fa-rotate-270";
                }
                else if (percentage >= 40) {
                    color = "warning";
                    battery = "battery-quarter fa-rotate-270";
                }
                else if (percentage > 0) {
                    color = "danger";
                    battery = "battery-quarter fa-rotate-270";
                }
                else if (percentage === 0) {
                    color = "danger";
                    battery = "battery-empty fa-rotate-270";
                }
                else if (percentage >= -40) {
                    color = "danger";
                    battery = "battery-quarter fa-rotate-90";
                }
                else if (percentage >= -60) {
                    color = "danger";
                    battery = "battery-half fa-rotate-90";
                }
                else if (percentage >= -80) {
                    color = "danger";
                    battery = "battery-three-quarters fa-rotate-90";
                }

                return (
                    <div key={ idx } className="col-md-6">
                        <div className="card card-body">
                            <div className="media mb-3">
                                <div className="media-body">
                                    <h6 className="font-weight-semibold mb-0 text-capitalize">{ key }</h6>
                                    <span className="text-muted">Total : { statsData[key]['total'] }</span>
                                </div>

                                <div className="ml-3 align-self-center">
                                    <i className={ `fas fa-${battery} fa-2x text-${color}-400` }></i>
                                </div>
                            </div>

                            <div className="progress mb-2" style={ { height: '0.125rem' } }>
                                <div className={ `progress-bar bg-${color}-400` } style={ { width: `${percentage}%` } }>
                                </div>
                            </div>
                            <div>
                                <span className="float-right">{ statsData[key]["balance"] }</span>
                                Balance
			                </div>
                        </div>
                    </div>
                )
            });
        }
    }

    renderDataInRows() {
        // render data according to filtered or not filtered data
        return this.state.data.map((row, idx) => {
            var colorCode = { "color": "#4caf50", "fontWeight": "bolder" };
            var badge = <span className="badge badge-success">Approved</span>

            if (row.Status === "notapproved") {
                colorCode = { "color": "#f44336", "fontWeight": "bolder" };
                badge = <span className="badge badge-danger">Rejected</span>
            }
            else if (row.Status === "pending") {
                colorCode = { "color": "#888", "fontWeight": "bolder" };
                badge = <span className="badge badge-info">Pending</span>
            }
            else if (row.Status.toLowerCase() === "withdrawn") {
                colorCode = { "color": "#ff7043", "fontWeight": "bolder" };
                badge = <span className="badge badge-warning">Withdrawn</span>
            }
            else if (row.Status.toLowerCase() === "deleted") {
                colorCode = { "color": "#E91E63", "fontWeight": "bolder" };
                badge = <span className="badge bg-pink">Deleted</span>
            }

            return (
                <tr key={ idx }>
                    <td className="text-nowrap">
                        { badge }
                    </td>
                    <td className="text-nowrap text-capitalize">{ row['EmployeeName'] }</td>
                    <td className="text-nowrap text-capitalize">{ row['DesignationName'] ? row['DesignationName'] : 'N/A' }</td>
                    <td className="text-nowrap text-capitalize">{ row["leave_name"] ? row["leave_name"] : "N/A" }</td>
                    <td className="text-center text-nowrap">{ moment(row['AppliedDate']).format("DD-MMM-YYYY") }</td>
                    <td className="text-center text-nowrap">
                        { moment(row['LeaveRecord']['start_date']).format("DD-MMM-YYYY") } ...  { moment(row['LeaveRecord']['end_date']).format("DD-MMM-YYYY") }
                        {/* <span className="badge bg-blue badge-pill btn-theme ml-2" title="No of Days">{row['LeaveRecord']['no_of_days']}</span> */ }
                        <span className="ml-2" style={ colorCode }> ( { row['LeaveRecord']['no_of_days'] } ) </span>
                    </td>
                    <td className="text-center text-nowrap text-capitalize">
                        { row['LeaveRecord']['responded_by'] ? row['LeaveRecord']['responded_by'] : 'N/A' }
                    </td>
                </tr>
            )
        });
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (!deepCompare(newProps.leaveTypes, this.state.colorsLeaveTypes)) {
            this.setState({ colorsLeaveTypes: newProps.leaveTypes });
        }
    }

    render() {
        var table = <CustomLoader />
        if (this.state.data && this.state.data.length) {
            table =
                <div>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="">
                                <tr>
                                    <th className="text-center" style={ { width: "30px" } }>STATUS</th>
                                    <th>EMPLOYEE</th>
                                    <th>DESIGNATION</th>
                                    <th>LEAVE TYPE</th>
                                    <th className="text-center">APPLIED DATE</th>
                                    <th className="text-center">LEAVE DATE</th>
                                    <th className="text-center">RESPONDED BY </th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.renderDataInRows() }
                            </tbody>
                        </table>
                    </div>
                    <div className="row c-mt10">
                        <div className="col-sm-12 col-md-6">
                            <div className="records-info" role="status" aria-live="polite">
                                { `Showing ${this.state.skip + 1} to ${this.state.skip + this.state.data.length} of ${this.state.total} records` }
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 pagination-parent c-mt5r">
                            <Pagination
                                activePage={ this.state.activePage }
                                itemsCountPerPage={ this.state.size }
                                totalItemsCount={ this.state.total }
                                pageRangeDisplayed={ 5 }
                                onChange={ this.handlePageChange }
                                itemClass={ "page-item" }
                                linkClass={ "page-link" }
                                prevPageText={ "prev" }
                                nextPageText={ "next" }
                                innerClass={ "pagination" }
                                activeClass={ "active" }
                            />
                        </div>
                    </div>
                </div>
        }
        else if (this.state.data !== null) {
            table = <div className="alert alert-info" style={ { marginBottom: '0px' } }>
                <strong>Info!</strong> No Data Found.
				</div>;
        }

        var moreAction = [];
        moreAction.push(
            <div key="limitSelection" className="col-md-3 col-lg-2 col-xl-2 ml-auto">
                <div title="Records Per Page">
                    <Select
                        value={ pages.find(option => option.value === this.state.size) }
                        valueKey="value"
                        labelKey="label"
                        onChange={ this.onLimitChange }
                        options={ pages }
                        clearable={ false }
                    />
                </div>
            </div>
        )

        var moreActionYear = [];
        moreActionYear.push(
            <div key="yearSelection" className="col-md-3 col-lg-2 col-xl-2 ml-auto">
                <div title="Select Year">
                    <Select
                        value={ this.state.yearOptions.find(option => option.value === this.state.selectedYear) }
                        valueKey="value"
                        labelKey="label"
                        onChange={ this.handleYearChange }
                        options={ this.state.yearOptions }
                        clearable={ false }
                    />
                </div>
            </div>
        )

        return (
            <Fragment>
                {
                    (this.props.showStats) ?
                        <div className="row">
                            { this.renderStats() }
                        </div>
                        : ""
                }
                {
                    (this.props.showLeaveHistory) ?
                        <Card header="Leaves History" headerClickable={ false } moreActions={ moreAction } collapse={ true } reload={ true } onReload={ this.getLogsData } cardClass="border-left-2 border-left-indigo-400 border-right-2 border-right-indigo-400 rounded-0" headerClass="bg-white">
                            { table }
                        </Card>
                        : ""
                }
                {
                    (this.props.showLeaveHistoryGraph) ?
                        <Card header="Leaves History" headerTitleClass="dash-headers" moreActions={ moreActionYear } cardClass="border-left-2 border-left-pink-400 border-right-2 border-right-pink-400 rounded-0" headerClass="bg-white">
                            {/* <Bar
                                height={ 450 }
                                data={ this.state.leavesHistoryData }
                                options={ this.state.leavesOptions }
                            /> */}
                        </Card>
                        : ""
                }

            </Fragment>
        );
    }

}

function mapStateToProps({ leaveTypes }) {
    return { leaveTypes }
}

export default connect(mapStateToProps)(DashboardEmployee);

DashboardEmployee.defaultProps = {
    showStats: true,
    showLeaveHistory: true,
    showLeaveHistoryGraph: true,
    showCalendar: true
}
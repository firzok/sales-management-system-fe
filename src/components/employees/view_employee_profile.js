import React, { Component } from 'react';
import Header from '../common/header';
import PageHeader from '../common/page_header';
import SideMenu from '../common/side_menu';
import Footer from '../common/footer';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { EMPLOYEE_BASE_URL } from '../../config/rest_endpoints';
import { EMPLOYEES_BASE_URL, EDIT_EMPLOYEE, VIEW_PROFILE, LOAD_APP } from '../router/routeConstants';
import DashboardEmployee from '../dashboard/dashboard_employee';
import FormRenderer from '../common/form_renderer';
import { connect } from "react-redux";
import CustomLoader from '../common/loader';
import { colors, company } from '../../config/static_lists';


class EmployeeProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            employee_id: this.props.location.empID,
            personInfoContent: null,
            self: ('self' in this.props.location) ? this.props.location.self : false,
            isGettingData: false,
            backURL: EMPLOYEES_BASE_URL,
            isEditable: false,
            userInfo: {},
            profileData: {
                id: "...",
                name: "...",
                profile_picture: null,
                designation: "..."
            },
            selectedTab: "Personal Info",
            tabs: [
                // { name: "Personal Info", className: "fas fa-info-circle font-s-18 mr-2", render: true, _function: this.loadPersonInfo.bind(this) },
                // { name: "Leaves History", className: "fas fa-history font-s-18 mr-2", render: true, _function: this.loadLeaveHistory.bind(this) },
                // { name: "Attendance", className: "fas fa-calendar-alt font-s-18 mr-2", render: true, _function: this.loadAttendance.bind(this) }
            ],
            forms: {
                personal_info: {
                    name: "Personal Details",
                    cardClass: "border-left-2 border-left-primary-400 border-right-2 border-right-primary-400 rounded-0",
                    readOnly: true
                },
                official_info: {
                    name: "Job Details",
                    cardClass: "border-left-2 border-left-pink-400 border-right-2 border-right-pink-400 rounded-0",
                    readOnly: true
                },
                administrative_control: {
                    name: "Administrative Control",
                    cardClass: "border-left-2 border-left-pink-400 border-right-2 border-right-pink-400 rounded-0",
                    readOnly: true
                },
                mailing_info: {
                    name: "Mailing Details",
                    cardClass: "border-left-2 border-left-success-400 border-right-2 border-right-success-400 rounded-0",
                    readOnly: true
                },
                hr_details: {
                    name: "HR Details",
                    cardClass: "border-left-2 border-left-indigo-400 border-right-2 border-right-indigo-400 rounded-0",
                    readOnly: true
                },
                family_details: {
                    name: "Family Details",
                    cardClass: "border-left-2 border-left-orange-400 border-right-2 border-right-orange-400 rounded-0",
                    readOnly: true
                },
                qualification_details: {
                    name: "Qualification",
                    cardClass: "border-left-2 border-left-success-400 border-right-2 border-right-success-400 rounded-0",
                    readOnly: true
                },
                comments: {
                    name: "Comments",
                    cardClass: "border-left-2 border-left-indigo-400 border-right-2 border-right-indigo-400 rounded-0",
                    readOnly: true
                }
            },
            fields: [
                {
                    form: 'personal_info',
                    name: 'emp_id',
                    label: 'Employee ID',
                    placeholder: 'Enter Employee ID ...',
                    type: 'input',
                    size: 'col-md-4 ',
                },
                {
                    form: 'personal_info',
                    name: 'first_name',
                    label: 'First Name',
                    placeholder: 'Enter Employee First Name ...',
                    type: 'input',
                    size: 'col-md-4 ',
                    required: false
                },
                {
                    form: 'personal_info',
                    name: 'last_name',
                    label: 'Last Name',
                    placeholder: 'Enter Employee Full Name ...',
                    type: 'input',
                    size: 'col-md-4',
                    required: false
                },
                {
                    form: 'personal_info',
                    name: 'gender',
                    label: 'Gender',
                    placeholder: "Gender",
                    type: 'input',
                    size: 'col-md-4',
                    clearable: true,
                    required: false
                },
                {
                    form: 'personal_info',
                    name: 'email',
                    label: 'Email',
                    placeholder: 'Enter Employee Email ...',
                    type: 'email',
                    size: 'col-md-4 ',
                    pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$',
                },
                {
                    form: 'personal_info',
                    name: 'contact',
                    label: 'Contact Number',
                    placeholder: 'Contact Number without - ',
                    type: 'input',
                    size: 'col-md-4',
                    required: false
                },
                {
                    form: 'personal_info',
                    name: 'dob',
                    label: 'Date of Birth',
                    placeholder: 'Date of Birth',
                    type: 'date',
                    size: 'col-md-4 ',
                    required: false
                },
                {
                    form: 'personal_info',
                    name: 'religion',
                    label: 'Religion',
                    placeholder: 'Religion',
                    type: 'input',
                    size: 'col-md-4 ',
                    clearable: true,
                    required: false,
                    render: false,
                    show: false,
                },
                {
                    form: 'personal_info',
                    name: 'marital_status',
                    label: 'Marital Status',
                    placeholder: 'Marital Status',
                    type: 'input',
                    size: 'col-md-4 ',
                    clearable: true,
                    required: false
                },
                {
                    form: 'personal_info',
                    name: 'blood_group',
                    label: 'Blood Group',
                    placeholder: 'Blood Group',
                    type: 'input',
                    size: 'col-md-4 ',
                    clearable: true,
                    required: false,
                    render: false,
                    show: false,
                },
                {
                    form: 'personal_info',
                    name: 'nationality',
                    label: 'Nationality',
                    placeholder: 'Enter Employee Nationality ...',
                    type: 'input',
                    size: 'col-md-4 ',
                    required: false,
                    valueField: "name"
                },

                {
                    form: 'mailing_info',
                    name: 'country',
                    label: 'Country',
                    placeholder: 'Country',
                    type: 'input',
                    size: 'col-md-3 ',
                    required: false,
                    valueField: "name"
                },
                {
                    form: 'mailing_info',
                    name: 'city',
                    label: 'City',
                    placeholder: 'City',
                    type: 'input',
                    size: 'col-md-3 ',
                    required: false,
                    valueField: "name"
                },
                {
                    form: 'mailing_info',
                    name: 'street',
                    label: 'Street',
                    placeholder: 'Street',
                    type: 'input',
                    size: 'col-md-3 ',
                    required: false,
                },
                {
                    form: 'mailing_info',
                    name: 'postal_code',
                    label: 'Postal Code',
                    placeholder: 'Postal Code',
                    type: 'input',
                    size: 'col-md-3 ',
                    required: false,
                },
                {
                    form: 'mailing_info',
                    name: 'additional_info',
                    label: 'Additional Info',
                    type: 'textarea',
                    size: 'col-md-12 ',
                    required: false,
                    rows: "3",
                    cols: "50",
                    placeholder: "Enter Additional Info ... "
                },

                {
                    form: 'family_details',
                    name: 'nok_name',
                    label: 'Next of Kin [NOK]',
                    placeholder: 'Next Of Kin ...',
                    type: 'input',
                    size: 'col-md-4 ',
                    required: false
                },
                {
                    form: 'family_details',
                    name: 'nok_relation',
                    label: 'Relation With NOK',
                    placeholder: "Relationship",
                    type: 'input',
                    size: 'col-md-4 ',
                    required: false
                },
                {
                    form: 'family_details',
                    name: 'nok_contact',
                    label: 'NOK Contact Number',
                    placeholder: 'NOK Contact Number without - ',
                    type: 'input',
                    size: 'col-md-4',
                    required: false
                },

                {
                    form: 'administrative_control',
                    name: 'roles',
                    label: 'Administrative Rights',
                    placeholder: 'Select Role',
                    type: 'input',
                    size: 'col-md-4 ',
                    clearable: true,
                    required: true,
                },
                {
                    form: 'official_info',
                    name: 'position',
                    label: 'Position',
                    placeholder: 'Enter Employee Position ...',
                    type: 'input',
                    size: 'col-md-4 ',
                    required: true
                },
                {
                    form: 'official_info',
                    name: 'team_lead',
                    label: 'Team Lead',
                    placeholder: 'Team Lead .....',
                    type: 'input',
                    size: 'col-md-4',
                    clearable: true,
                    required: false
                },
                {
                    form: 'official_info',
                    name: 'domain_head',
                    label: 'People Coordinator',
                    placeholder: 'People Coordinator ......',
                    type: 'input',
                    size: 'col-md-4',
                    clearable: true,
                    required: false
                },
                {
                    form: 'official_info',
                    name: 'company_head',
                    label: 'Development Head',
                    placeholder: 'Development Head .....',
                    type: 'input',
                    size: 'col-md-4 ',
                    clearable: true,
                    required: false
                },
                {
                    form: 'official_info',
                    name: 'direct_reports',
                    label: 'Direct Report',
                    placeholder: 'Direct Report',
                    type: 'input',
                    size: 'col-md-4 ',
                    required: false,
                },
                {
                    form: 'official_info',
                    name: 'designation',
                    label: 'Designation',
                    placeholder: 'Designation',
                    value: '',
                    type: 'input',
                    size: 'col-md-4',
                    clearable: true,
                    required: false,
                    valueField: "name"
                },
                {
                    form: 'official_info',
                    name: 'finger_id',
                    label: 'Finger ID',
                    placeholder: 'Finger ID',
                    type: 'input',
                    size: 'col-md-4 ',
                    min: 0,
                    max: 20,
                    required: false,
                    show: true
                },

                {
                    form: 'hr_details',
                    name: 'human_resource',
                    label: 'Human Resource',
                    placeholder: 'Human Resource ',
                    type: 'input',
                    size: 'col-md-4 ',
                    required: false,
                },
                {
                    form: 'hr_details',
                    name: 'currency',
                    label: 'Currency',
                    placeholder: 'Currency ',
                    type: 'input',
                    size: 'col-md-4',
                    required: false,
                    valueField: "name"
                },
                {
                    form: 'hr_details',
                    name: 'hire_date',
                    label: 'Hiring Date',
                    placeholder: 'Hire Date',
                    type: 'date',
                    size: 'col-md-4 ',
                    required: false
                },
                {
                    form: 'hr_details',
                    name: 'doc',
                    label: 'Date of Confirmation',
                    placeholder: 'Confirmation Date',
                    type: 'date',
                    size: 'col-md-4 ',
                    required: false,
                },
                {
                    form: 'hr_details',
                    name: 'resignation_date',
                    label: 'Resignation Date',
                    placeholder: 'Resignation Date',
                    type: 'date',
                    size: 'col-md-4 ',
                    required: false,
                },
                {
                    form: 'hr_details',
                    name: 'last_working_day',
                    label: 'Last Working Date',
                    placeholder: 'Last Working Date',
                    type: 'date',
                    size: 'col-md-4 ',
                    required: false,
                },
                // {
                //     form: 'hr_details',
                //     name: 'adjustments',
                //     label: 'Adjustments',
                //     placeholder: 'Adjustments',
                //     type: 'number',
                //     size: 'col-md-4 ',
                //     min: 0,
                //     required: false
                // },

                {
                    form: 'qualification_details',
                    name: 'qualification',
                    label: 'Employee Qualification',
                    placeholder: 'Employee Qualification ...',
                    type: 'textarea',
                    size: 'col-md-12 ',
                    required: false,
                    rows: "3",
                    cols: "50"
                },

                {
                    form: 'comments',
                    name: 'comments',
                    label: 'Comments',
                    placeholder: 'Comments ...',
                    type: 'textarea',
                    size: 'col-md-12 ',
                    required: false,
                    rows: "3",
                    cols: "50"
                }
            ]
        };

        // this.UpdateTabsRendering = this.UpdateTabsRendering.bind(this);
        // this.makeFormData = this.makeFormData.bind(this);
        // this.loadPersonInfo = this.loadPersonInfo.bind(this);
        // this.loadLeaveHistory = this.loadLeaveHistory.bind(this);
        // this.loadAttendance = this.loadAttendance.bind(this);
        // this.editUser = this.editUser.bind(this);
        // this.resetComponent = this.resetComponent.bind(this);
    }

    resetComponent() {
        var isGettingData = false;
        var selectedTab = "Personal Info";
        this.setState({ isGettingData, selectedTab })
    }

    UNSAFE_componentWillMount() {
        // get the employee details
        this.getEmployeeData();
        this.UpdateTabsRendering();
        this.UpdateBackButton();
    }


    UpdateBackButton() {
        // var permission = this.props.activeUser['permissions'].split(",")
        var backURL = this.state.backURL;
        // if (permission.includes(EMPLOYEES_BASE_URL)) {
        backURL = EMPLOYEES_BASE_URL;
        // }
        // else {
        //     backURL = LOAD_APP;
        // }

        this.setState({ backURL })
    }

    getEmployeeData() {
        // var permission = this.props.activeUser['permissions'].split(",")
        if (this.state.employee_id) {
            this.setState({ isGettingEmployee: true });
            var headers = {
                self: this.state.self
            }

            axios.get(`${EMPLOYEE_BASE_URL}/${this.state.employee_id}`, { headers }).then((res) => {
                var data = res.data.data[0];
                data['roles'] = res.data.role;

                var userInfo = {
                    empID: data['emp_id'],
                    firstname: data['first_name'],
                    lastname: data['last_name'],
                    roles: data['roles'],
                    email: data['email'],
                    username: data['email']
                }

                var profileData = {
                    id: data['emp_id'],
                    name: data["name"],
                    profile_picture: data["profile_picture"],
                    designation: (data["designation"]) ? data["designation"]['name'] : ""
                };



                var fields = this.makeFormData(data, this.state.fields);
                this.setState({ fields, profileData, userInfo, isGettingEmployee: false }, () => {
                    var personInfoContent = <FormRenderer
                        forms={ this.state.forms }
                        fields={ this.state.fields }
                        link={ this.props.location.caller }
                        showBtn={ false }
                    />;
                });
            })

            // if (permission.includes(EDIT_EMPLOYEE)) {
            this.setState({ isEditable: true })
            // }
        }
        else {
            // if (permission.includes(EMPLOYEES_BASE_URL)) {
            this.props.history.push(EMPLOYEES_BASE_URL);
            // }
            // else {
            this.props.history.push("/");
            // }
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        /** Clear previous state */
        this.resetComponent();

        /** Load New Employee Details */
        var __self = ('self' in newProps.location) ? newProps.location.self : false;
        this.setState({
            employee_id: newProps.location.empID,
            self: __self
        }, () => {
            this.getEmployeeData();
            this.UpdateTabsRendering();
            this.UpdateBackButton();
        });
    }

    UpdateTabsRendering() {
        // show the salary tab if admin is login
        var role = this.props.activeUser.user.roles;
        var userID = this.props.activeUser.user.empID;

        // if (role.toLowerCase() === 'admin' || userID === this.state.employee_id) {
        var tabs = this.state.tabs;
        tabs = this.state.tabs.map((tab, idx) => {
            if (tab.name.toLowerCase() === 'salary history') {
                tab.render = true
            }
            return tab
        })

        this.setState({ tabs })
        // }
    }

    makeFormData(data) {
        var fields = [...this.state.fields];

        fields.map((field, idx) => {

            /**
             * if {data} contain field value then field render must be true
             * if render key not in {field} and {data} does not contain that field value
             *    then set the default value :: false
             */

            field['render'] = false;

            if (field['name'] in data) {
                field['render'] = true
            }

            if (typeof (data[field['name']]) === 'object') {
                if (data[field['name']] != null)
                    field['value'] = data[field['name']][field['valueField']]
                else
                    field['value'] = null
            }
            else {
                field['value'] = data[field['name']] + ""
            }

        });

        return fields;
    }

    getID(searchParam) {
        const emp_id = searchParam.split("?")[1].trim()
        return emp_id;
    }

    editUser(employee_id) {
        this.props.history.push({
            pathname: EDIT_EMPLOYEE,
            edit: true,
            emp_id: employee_id,
            caller: VIEW_PROFILE
        });
    }

    onTabClick(tab) {
        var isGettingData = true;
        this.setState({ isGettingData })

        var selectedTab = this.state.selectedTab;

        this.state.tabs.map((T, idx) => {
            if (T.name === tab.name) {
                selectedTab = T.name;
                T._function()
            }
        })

        this.setState({ selectedTab })
    }

    loadPersonInfo() {
        this.getEmployeeData();
    }

    loadPersonInfoContent() {
        const content = this.state.personInfoContent;
        this.setState({ content, isGettingData: false });
    }

    loadLeaveHistory() {
        const content = <DashboardEmployee showCalendar={ false } activeUser={ this.state.userInfo }> </DashboardEmployee>
        this.setState({ content, isGettingData: false });
    }

    render() {
        var profilePicture = this.state.profileData["profile_picture"];
        var profileName = this.state.profileData["name"];
        var defaultProfilePicture = process.env.PUBLIC_URL + "/assets/images/avatar.png";
        const initials = profileName.charAt(0).toLowerCase();
        const style = {
            backgroundColor: colors[initials],
            cursor: 'auto'
        }

        var picture = <button className="btn rounded-circle profile-pic" style={ style }>
            <span className="text-uppercase text-white">{ initials }</span>
        </button>;
        if (profilePicture !== null && profilePicture !== '') {
            picture = <img src={ profilePicture } onError={ (e) => { e.target.onerror = null; e.target.src = defaultProfilePicture } } className="rounded-circle profile-pic" alt="" />
        }

        {/** Render Loader */ }
        var loader = "";
        if (this.state.isGettingData) {
            loader = <div className="loading-container-app">
                <span className="badge bg-warning-400 loading-content-app py-2 px-2 font-s-12">Loading...</span>
            </div>;
        }

        var cover = {
            backgroundImage: `url(/assets/images/${company}/bg.png)`
        }

        return (
            <div className="virtual-body navbar-top-custom">
                { loader }
                <Header />
                <div className="page-content">
                    <SideMenu />
                    {/* <!-- Main content --> */ }
                    <div className="content-wrapper">
                        <PageHeader header="Employee Profile" />
                        {/* <!-- Cover area --> */ }
                        <div className="profile-cover">
                            <div className="profile-cover-img" style={ cover }></div>
                            <div className="media align-items-center text-center text-md-left flex-column flex-md-row m-0">
                                <div className="mr-md-3 mb-0 mb-md-0">
                                    <div className="profile-thumb">
                                        { picture }
                                    </div>
                                </div>
                                <div className="media-body text-white mb-2">
                                    <h1 className="mb-0 text-capitalize" style={ { fontSize: '20px' } }>{ this.state.profileData.name }</h1>
                                    <span className="d-block text-capitalize">{ this.state.profileData.designation }</span>
                                </div>
                            </div>
                        </div>
                        {/* <!-- Profile navigation --> */ }
                        <div className="navbar navbar-expand-lg navbar-light bg-light">
                            <div className="text-center d-lg-none w-100">
                                <button type="button" className="navbar-toggler dropdown-toggle" data-toggle="collapse" data-target="#navbar-second">
                                    <i className="icon-menu7 mr-2"></i>
                                    Profile Navigation
                                </button>
                            </div>
                            <div className="navbar-collapse collapse" id="navbar-second">
                                <ul className="nav navbar-nav">
                                    {
                                        this.state.tabs.map((T, idx) => {
                                            if (T.render === true) {
                                                const c1 = "navbar-nav-link"
                                                const c2 = "navbar-nav-link active"

                                                return <li key={ idx } className="nav-item cursor-pointer" onClick={ this.onTabClick.bind(this, T) }>
                                                    <a className={ (this.state.selectedTab == T.name) ? c2 : c1 } data-toggle="tab">
                                                        <i className={ T.className }></i>
                                                        { T.name }
                                                    </a>
                                                </li>
                                            }
                                        })
                                    }
                                </ul>
                                <ul className="navbar-nav ml-lg-auto">
                                    {
                                        (this.state.isEditable) ?
                                            <li className="nav-item">
                                                <a onClick={ this.editUser.bind(this, this.state.profileData.id) } className="navbar-nav-link">
                                                    <i className="fas fa-user-edit font-s-18 mr-2"></i>
                                                    Edit
                                                </a>
                                            </li> : ""
                                    }
                                    <li className="nav-item">
                                        <a onClick={ () => { this.props.history.push(this.state.backURL) } } className="navbar-nav-link">
                                            <i className="fas fa-arrow-left font-s-18 mr-2"></i>
                                            Back
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* <!-- Content area --> */ }
                        <div className="content">
                            {
                                (this.state.isGettingData) ?
                                    <CustomLoader />
                                    : this.state.content
                            }
                        </div>

                        <Footer />
                    </div>
                </div>
            </div>
        );
    }
};

function mapStateToProps({ activeUser }) {
    return { activeUser }
}

export default withRouter(connect(mapStateToProps)(EmployeeProfile));
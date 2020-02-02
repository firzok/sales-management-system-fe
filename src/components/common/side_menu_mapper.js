import {
    LOAD_APP, ROLE_BASE_URL, ADD_ROLE, ACTIVITY_LOGS_BASE_URL, ACTIVITY_LOGS_TIMELINE, EMPLOYEES_BASE_URL, ADD_EMPLOYEE, ADD_LEAVE_TYPE, LEAVE_BASE_URL, APPLY_LEAVE,
    VIEW_LEAVE_HISTORY, UPDATE_TEAM, VIEW_PENDING_HISTORY, TIME_OF_BALANCES, REPORTS_BASE_URL, MARK_ATTENDANCE, INVOICING, IMPORTS, CUSTOMIZATION, NATIONALITY, COUNTRY,
    CITY, CURRENCY, PUBLIC_HOLIDAYS, HEAD_COUNT, ADDITTIONS_TERMINATIONS, CONFIGURATIONS, APPROVE_ATTENDANCE, ATTENDANCE_BASE_URL, SALARY_HISTORY, VIEW_LEAVE_TYPES,
    DESIGNATIONS, PC_WISE_PENDING_COUNT, EMPLOYEES_LEAVES_BALANCE, ADJUSTMENTS, TREND_ANALYSIS_BASE_URL, ATTENDANCE_TREND, LEAVES_TREND, EMPLOYEES_DISTRIBUTION,
    ANNOUNCEMENTS_URL,
    AI_REPORTS_BASE_URL,
    LEAVES_AI_REPORT,
    ATTENDANCE_AI_REPORT, CARRY_FORWARD_LEAVES_BALANCES, DETAILED_BALANCES
} from "../router/routeConstants";

export var naver = {
    [LOAD_APP]: {
        "/": {
            "id": "M_LOAD_APP",
            "name": "Dashboard",
            "url": LOAD_APP,
            "fa_icon": "fa fa-home",
        },
        "fa_icon": "fa fa-home"
    },
    [EMPLOYEES_BASE_URL]: {
        "/": {
            "id": "M_EMPLOYEES_BASE_URL",
            "name": "View Employees",
            "url": EMPLOYEES_BASE_URL,
            "fa_icon": "fas fa-users"
        },
        "/add-employee": {
            "id": "M_ADD_EMPLOYEE",
            "name": "Add Employee",
            "url": ADD_EMPLOYEE,
            "fa_icon": "fas fa-users"
        },
        "/update-team": {
            "id": "M_UPDATE_TEAM",
            "name": "Update Team",
            "url": UPDATE_TEAM,
            "fa_icon": "fas fa-users"
        },
        "/adjustments": {
            "id": "M_ADJUSTMENTS",
            "name": "Adjustments",
            "url": ADJUSTMENTS,
            "fa_icon": "fas fa-sliders-v"
        },
        "fa_icon": "fas fa-users"
    },
    [LEAVE_BASE_URL]: {
        "/apply-leave": {
            "id": "M_APPLY_LEAVE",
            "name": "Apply Leave",
            "url": APPLY_LEAVE,
            "fa_icon": "fas fa-running fa-flip-horizontal"
        },
        "/view-leaves": {
            "id": "M_VIEW_LEAVE",
            "name": "Leaves History",
            "url": VIEW_LEAVE_HISTORY,
            "fa_icon": "fas fa-running fa-flip-horizontal"
        },
        "/pending-leaves": {
            "id": "M_VIEW_PENDING_LEAVE",
            "name": "Pending Leaves",
            "url": VIEW_PENDING_HISTORY,
            "fa_icon": "fas fa-running fa-flip-horizontal"
        },
        "/view-leave-types": {
            "id": "M_VIEW_LEAVE_TYPES",
            "name": "View Leave Types",
            "url": VIEW_LEAVE_TYPES,
            "fa_icon": "fas fa-list-ul"
        },
        "/add-leave-type": {
            "id": "M_ADD_LEAVE_TYPE",
            "name": "Add Leave Type",
            "url": ADD_LEAVE_TYPE,
            "fa_icon": "fas fa-list-ul"
        },
        "fa_icon": "fas fa-running fa-flip-horizontal"
    },
    [REPORTS_BASE_URL]: {
        "/time-of-balances": {
            "id": "M_TIME_OF_BALANCES",
            "name": "Time Off Balances",
            "url": TIME_OF_BALANCES,
            "fa_icon": "fas fa-chart-line"
        },
        "/detailed-balances": {
            "id": "M_DETAILED_BALANCES",
            "name": "Detailed Balances",
            "url": DETAILED_BALANCES,
            "fa_icon": "fas fa-chart-line"
        },
        "/employees-distribution": {
            "id": "M_EMPLOYEES_DISTRIBUTION",
            "name": "Employees Distribution",
            "url": EMPLOYEES_DISTRIBUTION,
            "fa_icon": "fas fa-chart-line"
        },
        "/head-count": {
            "id": "M_HEAD_COUNT",
            "name": "Head Count",
            "url": HEAD_COUNT,
            "fa_icon": "fas fa-chart-line"
        },
        "/get-additions-terminations": {
            "id": "M_ADDITION_TERMINTION",
            "name": "Additions & Termination",
            "url": ADDITTIONS_TERMINATIONS,
            "fa_icon": "fas fa-chart-line"
        },
        "/salary-history": {
            "id": "M_SALARY_HISTORY",
            "name": "Salary History",
            "url": SALARY_HISTORY,
            "fa_icon": "fas fa-money-bill-wave"
        },
        "/pc-wise-pending-count": {
            "id": "M_PC_WISE_PENDING_COUNT",
            "name": "Pending Leaves Count",
            "url": PC_WISE_PENDING_COUNT,
            "fa_icon": "fas fa-money-bill-wave"
        },
        "/employees-leaves-balance": {
            "id": "M_EMPLOYEES_LEAVES_BALANCE",
            "name": "Employees Leaves Balance",
            "url": EMPLOYEES_LEAVES_BALANCE,
            "fa_icon": "fas fa-money-bill-wave"
        },
        "/carry-forward-leaves-balances": {
            "id": "M_CARRY_FORWARD_LEAVES_BALANCE",
            "name": "Leaves Balance",
            "url": CARRY_FORWARD_LEAVES_BALANCES,
            "fa_icon": "fas fa-money-bill-wave"
        },
        "fa_icon": "fas fa-chart-bar"
    },
    [AI_REPORTS_BASE_URL]: {
        "/leaves": {
            "id": "M_LEAVES_AI_REPORT",
            "name": "Leaves AI Report",
            "url": LEAVES_AI_REPORT,
            "fa_icon": "fas fa-project-diagram"
        },
        "/attendance": {
            "id": "M_ATTENDANCE_AI_REPORT",
            "name": "Attendance AI Report",
            "url": ATTENDANCE_AI_REPORT,
            "fa_icon": "fas fa-project-diagram"
        },
        "fa_icon": "fas fa-project-diagram"
    },
    [TREND_ANALYSIS_BASE_URL]: {
        "/leaves": {
            "id": "M_LEAVES_TREND",
            "name": "Leaves Trend",
            "url": LEAVES_TREND,
            "fa_icon": "fas fa-chart-line"
        },
        "/attendance": {
            "id": "M_ATTENDANCE_TREND",
            "name": "Attendance Trend",
            "url": ATTENDANCE_TREND,
            "fa_icon": "fas fa-chart-line"
        },
        "fa_icon": "fas fa-chart-line"
    },
    [ROLE_BASE_URL]: {
        "/": {
            "id": "M_VIEW_ROLE",
            "name": "View Administrative Rights",
            "url": ROLE_BASE_URL,
            "fa_icon": "fas fa-user-lock"
        },
        "/add-administrative-right": {
            "id": "M_ADD_ROLE",
            "name": "Add Administrative Right",
            "url": ADD_ROLE,
            "fa_icon": "fas fa-user-shield"
        },
        "fa_icon": "fas fa-user-shield"
    },
    [ACTIVITY_LOGS_BASE_URL]: {
        "/": {
            "id": "M_VIEW_ROLE",
            "name": "Tabular",
            "url": ACTIVITY_LOGS_BASE_URL,
            "fa_icon": "fas fa-fingerprint"
        },
        "/timeline": {
            "id": "M_ACTIVITY_LOGS_TIMELINE",
            "name": "Timeline",
            "url": ACTIVITY_LOGS_TIMELINE,
            "fa_icon": "fas fa-fingerprint"
        },
        "fa_icon": "fas fa-fingerprint"
    },
    [ATTENDANCE_BASE_URL]: {
        "/mark-attendance": {
            "id": "M_MARK_ATTENDANCE",
            "name": "Mark Attendance",
            "url": MARK_ATTENDANCE,
            "fa_icon": "fas fa-calendar-alt"
        },
        "/approve-attendance": {
            "id": "M_APPROVE_ATTENDANCE",
            "name": "Approve Attendance",
            "url": APPROVE_ATTENDANCE,
            "fa_icon": "fas fa-calendar-alt"
        },
        "fa_icon": "fas fa-calendar-alt"
    },
    [INVOICING]: {
        "/invoicing": {
            "id": "M_INVOICING",
            "name": "Invoicing",
            "url": INVOICING,
            "fa_icon": "fas fa-receipt"
        },
        "fa_icon": "fas fa-receipt"
    },
    [IMPORTS]: {
        "/imports": {
            "id": "M_IMPORTS",
            "name": "Imports",
            "url": IMPORTS,
            "fa_icon": "fas fa-file-import"
        },
        "fa_icon": "fas fa-file-import"
    },
    [ANNOUNCEMENTS_URL]: {
        "/announcements": {
            "id": "M_ANNOUNCEMENTS_URL",
            "name": "Announcements",
            "url": ANNOUNCEMENTS_URL,
            "fa_icon": "fas fa-bullhorn"
        },
        "fa_icon": "fas fa-bullhorn"
    },
    [CUSTOMIZATION]: {
        "/nationalities": {
            "id": "C_NATIONALITY",
            "name": "Nationality",
            "url": NATIONALITY,
            "fa_icon": "fas fa-list-ul"
        },
        "/countries": {
            "id": "C_COUNTRY",
            "name": "Country",
            "url": COUNTRY,
            "fa_icon": "fas fa-list-ul"
        },
        "/cities": {
            "id": "C_CITY",
            "name": "City",
            "url": CITY,
            "fa_icon": "fas fa-list-ul"
        },
        "/currencies": {
            "id": "C_CURRENCY",
            "name": "Currency",
            "url": CURRENCY,
            "fa_icon": "fas fa-list-ul"
        },
        "/public-holidays": {
            "id": "C_PUBLIC_HOLIDAYS",
            "name": "Public Holidays",
            "url": PUBLIC_HOLIDAYS,
            "fa_icon": "fas fa-list-ul"
        },
        "/designation": {
            "id": "M_DESIGNATIONS",
            "name": "Designations",
            "url": DESIGNATIONS,
            "fa_icon": "fas fa-list-ul"
        },
        "fa_icon": "fas fa-list-ul"
    },
    [CONFIGURATIONS]: {
        "/configurations": {
            "id": "M_CONFIGURATIONS",
            "name": "Configurations",
            "url": CONFIGURATIONS,
            "fa_icon": "fas fa-cog"
        },
        "fa_icon": "fas fa-cog"
    }
}

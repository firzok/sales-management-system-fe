import {
    LOAD_APP, EMPLOYEES_BASE_URL, ADD_EMPLOYEE, UPDATE_TEAM, CONFIGURATIONS, ADJUSTMENTS, NEW_ORDER, ALL_ORDERS
} from "../router/routeConstants";

export var naver = {
    [LOAD_APP]: {
        "/": {
            "id": "M_LOAD_APP",
            "name": "Dashboard",
            "url": LOAD_APP,
            "fa_icon": ['fas', 'home'],
        },
        "fa_icon": ['fas', 'home']

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
    [CONFIGURATIONS]: {
        "/configurations": {
            "id": "M_CONFIGURATIONS",
            "name": "Configurations",
            "url": CONFIGURATIONS,
            "fa_icon": "fas fa-cog"
        },
        "fa_icon": "fas fa-cog"
    },
    [NEW_ORDER]: {
        "/": {
            "id": "NEW_ORDER",
            "name": "New Order",
            "url": NEW_ORDER,
            "fa_icon": ['fas', 'cart-plus']
        },
        "fa_icon": ['fas', 'cart-plus']
    },
    [ALL_ORDERS]: {
        "/": {
            "id": "ALL_ORDERS",
            "name": "All Orders",
            "url": ALL_ORDERS,
            "fa_icon": ['fas', 'search']
        },
        "fa_icon": ['fas', 'search']
    }
}

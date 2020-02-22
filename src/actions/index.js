import axios from 'axios';

import { USER_AUTHENITCATION, USER_BASE_URL, LEAVE_TYPES_LIST } from '../config/rest_endpoints'
import { getPascalCase, isValidJSON } from '../assets/js/helper';

export const LOGIN = "login";
export const ACTIVE_USER = "save_user";
export const NOTIFICATION = "notification";
export const LEAVE_TYPES = "leave_types";

axios.interceptors.request.use(request => {
    if (isValidJSON(localStorage.getItem('user'))) {
        var user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            request['headers']['Authorization'] = `${user['token_type']} ${user['access_token']}`;
        }
        return request
    }
})

axios.interceptors.response.use(response => {
    if (response.data === "") {
        response.data = [];
    }
    return response;
});

/**
 * This function will convert the data into select options
 * @param {*} responseData 
 */
export function makeList(responseData, valueKey, labelKey, showID = false) {
    for (var i = 0; i < responseData.length; i++) {
        responseData[i]["value"] = responseData[i][valueKey];
        if (showID) {
            responseData[i]["label"] = `${getPascalCase(responseData[i][labelKey])} (${responseData[i][valueKey]})`;
        }
        else {
            responseData[i]["label"] = `${getPascalCase(responseData[i][labelKey])}`;
        }
    }
    return responseData
}

export function makeListFromObj(responseData, valueKey, labelKey, showID = false) {
    var list = [];
    for (var key in responseData) {
        if (showID) {
            list.push({ value: responseData[key][valueKey], label: `${getPascalCase(responseData[key][labelKey])} (${responseData[key][valueKey]})` });
        }
        else {
            list.push({ value: responseData[key][valueKey], label: `${getPascalCase(responseData[key][labelKey])}` });
        }
    }
    return list;
}

export function makeListFromSingleObj(responseData) {
    var list = [];
    for (var key in responseData) {
        list.push({ value: key, label: getPascalCase(responseData[key]) });
    }
    return list;
}

/**
 * clear the value of all field from fields dictionary and 
 * if there is a default value exist in defaultValues dictionary then assign that value
 * to that field
 * 
 * @param {*} fields            dictionary of field(s)
 * @param {*} defaultValues     dictionary containing default value of field(s)
 */
export function clearForm(fields, defaultValues = {}) {
    for (var idx in fields) {
        var field = fields[idx];
        if (field.name in defaultValues) {
            field.value = defaultValues[field.name];
        }
        else {
            field.value = ''
        }
    }
    return fields
}

export function login(loginDetails) {
    return function (dispatch) {
        axios.defaults.withCredentials = true;
        axios({
            method: 'post',
            url: USER_AUTHENITCATION,
            data: loginDetails,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        })
            .then(res => {
                dispatch({
                    type: ACTIVE_USER,
                    payload: res
                })
            }).catch(error => {
                var c_error = error.response;
                if (c_error === undefined) {
                    c_error = { "data": { "message": "Network Error" } };
                }
                dispatch({
                    type: ACTIVE_USER,
                    payload: c_error
                })
            });
    }
}

export function fetchUser(userid) {
    axios.defaults.timeout = 80000;
    return function (dispatch) {
        axios({
            method: 'get',
            url: `${USER_BASE_URL}/${userid}`
        })
            .then(res => {
                dispatch({
                    type: ACTIVE_USER,
                    payload: res
                })
            }).catch(error => {
                var c_error = error.response;
                if (c_error === undefined) {
                    c_error = { "data": { "message": "Network Error" } };
                }
                dispatch({
                    type: ACTIVE_USER,
                    payload: c_error
                })
            });
    }
}

export function getLeaveTypes() {
    return function (dispatch) {
        axios({
            method: 'get',
            url: `${LEAVE_TYPES_LIST}`
        })
            .then(res => {
                dispatch({
                    type: LEAVE_TYPES,
                    payload: res
                })
            }).catch(error => {
                var c_error = error.response;
                if (c_error === undefined) {
                    c_error = { "data": { "message": "Network Error" } };
                }
                dispatch({
                    type: LEAVE_TYPES,
                    payload: c_error
                })
            });
    }
}
import axios from 'axios';

import { USER_AUTHENITCATION, USER_BASE_URL } from '../config/rest_endpoints'
import { getPascalCase, isValidJSON } from '../assets/js/helper';

export const LOGIN = "login";
export const ACTIVE_USER = "save_user";
export const NOTIFICATION = "notification";
export const LEAVE_TYPES = "leave_types";

axios.interceptors.request.use(request => {
    if (isValidJSON(sessionStorage.getItem('user'))) {
        var user = JSON.parse(sessionStorage.getItem('user'));
        if (user) {
            request['headers']['Authorization'] = `Bearer ${user.jwt_token}`;
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
                if (res.status === 200) {
                    dispatch({
                        type: ACTIVE_USER,
                        payload: res
                    })

                } else {
                    console.log("Network Error")
                }
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

export function fetchUser(user) {
    axios.defaults.timeout = 80000;
    axios.defaults.withCredentials = true;
    return function (dispatch) {
        axios({
            method: 'get',
            url: `${USER_BASE_URL}/${user.empID}`
        })
            .then(res => {
                if (res.status === 200) {
                    dispatch({
                        type: ACTIVE_USER,
                        payload: res
                    })
                } else {
                    console.log("Network Error")
                }

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
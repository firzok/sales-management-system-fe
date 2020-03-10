import React, { useState, useEffect } from 'react';
import Container from '../common/application_container';

import OfflineTable from 'react-offline-table';
import moment from 'moment';
import axios from 'axios';
import { ALL_ORDERS } from '../../config/rest_endpoints';

function AllOrders(props) {

    const [productList, setProductList] = useState([]);
    const [gettingData, setGettingData] = useState(false);

    function getAllOrder() {
        setGettingData(true);

        var user = JSON.parse(sessionStorage.getItem('user'));
        axios({
            method: 'get',
            url: ALL_ORDERS,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                Authorization: `Bearer ${user.jwt_token}`
            },
            withCredentials: true
        })
            .then(
                res => {
                    setProductList(res.data);
                    setGettingData(false);
                }
            );
    }

    useEffect(() => {
        getAllOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function viewEmployee(selectedEmployeeID) {
        console.log("View Employee")
        console.log(selectedEmployeeID)
    }

    function editEmployee(selectedEmployeeID) {
        console.log("Edit Employee")
        console.log(selectedEmployeeID)
    }

    function changeStatus(newStatus, employee) {
        console.log("Status changed")
    }


    const headerFields = [
        {
            id: 0,
            type: "action",
            align: "text-center",
            name: "ACTIONS"
        },
        {
            id: 1,
            type: "text",
            align: "text-left",
            name: "ORDER#"
        },
        {
            id: 2,
            type: "media",
            sort: "sorting_asc",
            align: "text-left",
            name: "EMPLOYEE"
        },
        {
            id: 3,
            type: "media",
            sort: "sorting",
            align: "text-left",
            name: "CUSTOMER"
        },
        {
            id: 4,
            type: "text",
            sort: "sorting",
            align: "text-left",
            name: "ORDER DATE"
        },
        {
            id: 5,
            type: "text",
            sort: "sorting",
            align: "text-left",
            name: "DELIVERY DATE"
        },
        {
            id: 6,
            type: "text",
            sort: "sorting",
            align: "text-left",
            name: "ADVANCE PAYMENT"
        }
    ];

    const employeeData = [
        {
            emp_id: 1,
            status: "Main",
            name: "Tony Stark",
            profile_picture: null,
            dob: "April 4, 1965",
            played_by: "Robert Downey, Jr."

        },
        {
            emp_id: 2,
            status: "Villain",
            name: "Justin Hammer",
            profile_picture: null,
            dob: "November 5, 1968",
            played_by: "Sam Rockwell"

        },
        {
            emp_id: 3,
            status: "Villain",
            name: "Whiplash",
            profile_picture: null,
            dob: "September 16, 1952",
            played_by: "Mickey Rourke"

        },
        {
            emp_id: 4,
            status: "Support",
            name: "Happy Hogan",
            profile_picture: null,
            dob: "October 19, 1966",
            played_by: "Jon Favreau"

        },
        {
            emp_id: 5,
            status: "Main",
            name: "Thor",
            profile_picture: null,
            dob: "August 11, 1983",
            played_by: "Chris Hemsworth"

        },
        {
            emp_id: 6,
            status: "Main",
            name: "Captain America",
            profile_picture: null,
            dob: "June 13, 1981",
            played_by: "Chris Evans"

        },
        {
            emp_id: 7,
            status: "Support",
            name: "Howard Stark",
            profile_picture: null,
            dob: "June 2, 1978",
            played_by: "Dominic Cooper"

        },
        {
            emp_id: 8,
            status: "Support",
            name: "Pepper Potts",
            profile_picture: null,
            dob: "September 27, 1972",
            played_by: "Gwyneth Paltrow"

        },
        {
            emp_id: 9,
            status: "Main",
            name: "Natasha Romanoff",
            profile_picture: null,
            dob: "November 22, 1984",
            played_by: "Scarlett Johansson"

        },
        {
            emp_id: 10,
            status: "Main",
            name: "Bruce Banner",
            profile_picture: null,
            dob: "November 22, 1967",
            played_by: "Mark Ruffalo"

        },
    ];

    const EmployeeStatus = [
        { value: "probation", label: "Probation" },
        { value: "current", label: "Permanent" },
        { value: "resign", label: "Resign" },
        { value: "layoff", label: "LayOff" },
    ];

    const pages = [
        { value: 5, label: '5' },
        { value: 10, label: '10' },
        { value: 20, label: '20' },
        { value: 50, label: '50' },
        { value: 100, label: '100' }
    ]

    const colors = {
        a: "#2196f3",
        b: "#ec407a",
        c: "#ff9800",
        d: "#66bb6a",
        e: "#5c6bc0",
        f: "#ef5350",
        g: "#8d6e63",
        h: "#26a59a",
        i: "#ff9b12",
        j: "#343434",
        k: "#39589e",
        l: "#7886cb",
        m: "#26a59a",
        n: "#6A1B9A",
        o: "#283593",
        p: "#5C6BC0",
        q: "#4db6ab",
        r: "#444444",
        s: "#888888",
        t: "#37474F",
        u: "#4E342E",
        v: "#FF7043",
        w: "#263238",
        x: "#009688",
        y: "#00bcd4",
        z: "#8BC34A"
    };



    var _data = []

    for (var i = 0; i < productList.length; i++) {
        var row = [];

        // Column 1 ACTIONS
        const actions = [
            { icon: ['far', 'edit'], className: "text-info-600 cursor-pointer", callBack: () => console.log("WE GOOD") }
        ]
        row.push(actions)

        // Column 2 ORDER#
        row.push(productList[i].id ? productList[i].id : "N/A")

        // Column 3 EMPLOYEE 
        const employeeAvatar = { topText: productList[i].first_name + " " + productList[i].last_name, bottomText: productList[i].employee_id, picture: null };
        row.push(employeeAvatar);

        // Column 4 CUSTOMER
        const customerAvatar = { topText: productList[i].customer_name, bottomText: productList[i].customer_phone_number, picture: null };
        row.push(customerAvatar)

        // Column 5 ORDER DATE
        row.push((productList[i].placement_date === "" || productList[i].placement_date === null) ? 'N/A' : moment(productList[i].placement_date).format("DD-MM-YYYY"));

        // Column 6 DELIVERY DATE
        row.push((productList[i].delivery_date === "" || productList[i].delivery_date === null) ? 'N/A' : moment(productList[i].delivery_date).format("DD-MM-YYYY"));

        // Column 7 ADVANCE PAYMENT
        row.push(productList[i].advance_payment);

        _data.push(row);
    }

    return (

        <Container header="All Orders">
            <div className="card">

                <div className="card-body">
                    {
                        _data.length > 0 ?
                            <OfflineTable
                                headerFields={ headerFields }
                                data={ _data }
                                showSno={ false }
                                enableFilter={ true }
                                pages={ pages }
                                colors={ colors }
                            />
                            :
                            ""
                    }

                </div></div>
        </Container>


    )




}
export default AllOrders;
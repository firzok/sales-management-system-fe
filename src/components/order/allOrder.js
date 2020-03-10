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

    const headerFields = [
        {
            id: 0,
            type: "action",
            align: "text-center",
            name: "EDIT DATE"
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
            { icon: ['far', 'edit'], className: "text-info-800 cursor-pointer", callBack: () => console.log("WE GOOD") }
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
import React, { useState, useEffect } from 'react';
import Container from '../common/application_container';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Card } from 'reactstrap';
import OfflineTable from 'react-offline-table';
import moment from 'moment';
import axios from 'axios';
import { ALL_ORDERS, UPDATE_DELIVERY_DATE } from '../../config/rest_endpoints';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DatePicker from "react-datepicker";
import { addDays, subDays } from 'date-fns';
import { stringify } from 'querystring';
import { convertDate } from '../helper'

function AllOrders(props) {
    // State
    const [orderList, setOrderList] = useState([]);
    const [gettingData, setGettingData] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [deliveryDate, setDeliveryDate] = useState("");
    const [orderDate, setOrderDate] = useState("");
    const [dateUpdated, setDateUpdated] = useState(false);
    const [orderId, setOrderId] = useState("")
    const [dropDownEmployeeOpen, setDropDownEmployeeOpen] = useState(false)
    const [dropDownMonthOpen, setDropDownMonthOpen] = useState(false)
    const [dropDownYearOpen, setDropDownYearOpen] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState("")
    const [selectedMonth, setSelectedMonth] = useState("")
    const [selectedYear, setSelectedYear] = useState("")



    // Function
    function selectYear(year) {
        setSelectedYear(year)
    }

    function selectMonth(month) {
        setSelectedMonth(month)
    }

    function selectEmployee(employee) {
        setSelectedEmployee(employee)
    }

    const toggleEmployeeDropdown = () => setDropDownEmployeeOpen(prevState => !prevState);

    const toggleMonthDropdown = () => setDropDownMonthOpen(prevState => !prevState);

    const toggleYearDropdown = () => setDropDownYearOpen(prevState => !prevState);

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
                    if (res.status === 200) {
                        if (res.data.success === true) {
                            setOrderList(res.data.rows);
                            setGettingData(false);
                        } else {
                            alert("Unable to process request.")
                        }
                    } else {
                        console.log("Network Error")
                    }
                }
            );
    }

    function updateOrder() {
        var user = JSON.parse(sessionStorage.getItem('user'));
        axios({
            method: 'post',
            url: UPDATE_DELIVERY_DATE,
            data: stringify(
                {
                    order_id: orderId,
                    newDate: convertDate(deliveryDate)
                }
            ),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                Authorization: `Bearer ${user.jwt_token}`
            },
            withCredentials: true
        })
            .then(
                res => {
                    if (res.status === 200) {
                        if (res.data.success === true) {
                            setOpenModal(false)
                            setOrderList([])
                            setDateUpdated(false)
                            setDeliveryDate("")
                            setOrderDate("")

                            getAllOrder()
                        } else {
                            alert("Unable to process request.")
                        }
                    } else {
                        console.log("Network Error")
                    }
                });

    }

    function toggleModal() {
        setOpenModal(!openModal);
    }

    function openEditOrderModal(order) {
        setOrderDate(new Date(order.placement_date))
        setDeliveryDate(new Date(order.delivery_date))
        setOrderId(order.id)

        setOpenModal(true);
    }

    useEffect(() => {
        getAllOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // Data
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
            sort: "sorting_asc",
            align: "text-left",
            name: "ORDER#"
        },
        {
            id: 2,
            type: "media",
            sort: "sorting",
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

    const employeeList = [
        {
            name: "Firzok Nadeem",
            id: 1
        },
        {
            name: "Faateh Jarree",
            id: 2
        }
    ]

    const monthList = [
        {
            id: 1,
            name: "January"
        },
        {
            id: 2,
            name: "February"
        },
        {
            id: 3,
            name: "March"
        },
        {
            id: 4,
            name: "April"
        },
        {
            id: 5,
            name: "May"
        },
        {
            id: 6,
            name: "June"
        },
        {
            id: 7,
            name: "July"
        },
        {
            id: 8,
            name: "August"
        },
        {
            id: 9,
            name: "September"
        },
        {
            id: 10,
            name: "October"
        },
        {
            id: 11,
            name: "November"
        },
        {
            id: 12,
            name: "December"
        }
    ]

    const yearList = [2015, 2016, 2017, 2018, 2019, 2020]

    var _data = []

    for (var i = 0; i < orderList.length; i++) {
        var row = [];

        const currentOrder = orderList[i]
        // Column 1 ACTIONS
        const actions = [
            {
                icon: ['far', 'edit'],
                className: "text-info-800 cursor-pointer",
                callBack: () => openEditOrderModal(currentOrder)
            }
        ]
        row.push(actions)

        // Column 2 ORDER#
        row.push(orderList[i].id ? orderList[i].id : "N/A")

        // Column 3 EMPLOYEE 
        const employeeAvatar = { topText: String(orderList[i].first_name + " " + orderList[i].last_name), bottomText: String(orderList[i].employee_id), picture: null };
        row.push(employeeAvatar);

        // Column 4 CUSTOMER
        const customerAvatar = { topText: String(orderList[i].customer_name), bottomText: String(orderList[i].customer_phone_number), picture: null };
        row.push(customerAvatar)

        // Column 5 ORDER DATE
        row.push((orderList[i].placement_date === "" || orderList[i].placement_date === null) ? 'N/A' : moment(orderList[i].placement_date).format("DD-MM-YYYY"));

        // Column 6 DELIVERY DATE
        row.push((orderList[i].delivery_date === "" || orderList[i].delivery_date === null) ? 'N/A' : moment(orderList[i].delivery_date).format("DD-MM-YYYY"));

        // Column 7 ADVANCE PAYMENT
        var formatter = new Intl.NumberFormat('en-US');
        row.push(String(formatter.format(orderList[i].advance_payment) + " AED"));

        _data.push(row);
    }
    var modalHtml = <Modal
        isOpen={ openModal }
        toggle={ toggleModal }
    // className={ }
    >
        <ModalHeader toggle={ toggleModal }>Change Delivery Date</ModalHeader>
        <ModalBody>
            <div className="form-group">
                <label className="font-weight-semibold">Delivery Date <span className="c-failed" title="Required">*</span></label>

                <DatePicker
                    className="form-control"
                    dateFormat="MMMM d, yyyy"
                    selected={ deliveryDate }
                    onChange={ date => {
                        setDeliveryDate(date)
                        setDateUpdated(true)
                    } }
                    todayButton="Today"
                    minDate={ orderDate }
                />
            </div>
        </ModalBody>
        <ModalFooter>
            <Button title="Update"
                className="btn btn-theme btn-labeled"
                onClick={ () => updateOrder() }
                disabled={ !dateUpdated }
            >
                Update
                 </Button>
        </ModalFooter>
    </Modal >

    return (

        <Container header="All Orders">
            { modalHtml }
            <div className="card">

                <div className="card-body">

                    <div className="row justify-content-between">
                        <div className="col-md-3">

                            <Dropdown isOpen={ dropDownEmployeeOpen } toggle={ toggleEmployeeDropdown }>
                                <DropdownToggle caret className="btn btn-theme btn-labeled w-100 text-right">
                                    { selectedEmployee.name }
                                </DropdownToggle>
                                <DropdownMenu right>
                                    { employeeList.map((employee) =>
                                        <DropdownItem key={ employee.id }
                                            onClick={ () => selectEmployee(employee) }
                                        >
                                            { employee.name }
                                        </DropdownItem>
                                    ) }
                                </DropdownMenu>
                            </Dropdown>

                        </div>

                        <div className="col-md-3">
                            <Dropdown isOpen={ dropDownMonthOpen } toggle={ toggleMonthDropdown }>
                                <DropdownToggle caret className="btn btn-theme btn-labeled w-100 text-right">
                                    { selectedMonth.name }
                                </DropdownToggle>
                                <DropdownMenu right>
                                    { monthList.map((month) =>
                                        <DropdownItem key={ month.id }
                                            onClick={ () => selectMonth(month) }
                                        >
                                            { month.name }
                                        </DropdownItem>
                                    ) }
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <div className="col-md-3">
                            <Dropdown isOpen={ dropDownYearOpen } toggle={ toggleYearDropdown }>
                                <DropdownToggle caret className="btn btn-theme btn-labeled w-100 text-right">
                                    { selectedYear }
                                </DropdownToggle>
                                <DropdownMenu right>
                                    { yearList.map((year) =>
                                        <DropdownItem key={ year }
                                            onClick={ () => selectYear(year) }
                                        >
                                            { year }
                                        </DropdownItem>
                                    ) }
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>

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
                </div>
            </div>
        </Container >
    )
}
export default AllOrders;
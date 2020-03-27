import React, { useState, useEffect } from "react";
import Container from "../common/application_container";
import axios from "axios";
import { GET_ORDER_DETAIL } from "../../config/rest_endpoints"
import { withRouter } from "react-router-dom";
import {
    Card, Table, CardText, CardColumns,
    Input, CardBody
} from 'reactstrap';
import moment from "moment";

function Order(props) {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const [orderId, setOrderId] = useState(props.location.state.orderId)

    // ===========================Order Details==========================
    const [totaAmount, setTotalAmount] = useState(0)
    const [orderDetails, setOrderDetails] = useState("")
    const [paymentDetails, setPaymentDetails] = useState([])
    const [orderProducts, setOrderProducts] = useState([])


    useEffect(
        () => {
            setOrderId(props.location.state.orderId)
            getOrderDetails()
        }, [props.location.state.orderId]
    )

    function getOrderDetails() {
        axios({
            method: "get",
            url: `${GET_ORDER_DETAIL}/${orderId}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
                Authorization: `Bearer ${user.jwt_token}`
            },
            withCredentials: true
        }).then(res => {
            if (res.status === 200) {
                if (res.data.success === true) {
                    const data = res.data
                    setTotalAmount(data.totaAmount)
                    setOrderDetails(data.order)
                    setPaymentDetails(data.payments)
                    setOrderProducts(data.products)
                }
            } else {
                console.log("Network Error");
            }
        })
    }

    return (
        <Container header="Order Detail" >

            <Card>
                <CardBody>
                    <div className="row justify-content-around pb-3">
                        <div className="col-md-3">
                            <label className="font-weight-semibold">Order ID: </label>
                            <input
                                name="OrderId"
                                type="text"
                                className="form-control"
                                disabled={ true }
                                value={ orderId }
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="font-weight-semibold">Customer Name: </label>
                            <input
                                name="CustomerName"
                                type="text"
                                className="form-control"
                                disabled={ true }
                                value={ orderDetails.customer_name }
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="font-weight-semibold">Customer Number: </label>
                            <input
                                name="CustomerNumber"
                                type="text"
                                className="form-control"
                                disabled={ true }
                                value={ orderDetails.customer_phone_number }
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="font-weight-semibold">Customer TRN: </label>
                            <input
                                name="CustomerTRN"
                                type="text"
                                className="form-control"
                                disabled={ true }
                                value={ orderDetails.customer_trn }
                            />
                        </div>
                    </div>


                    <div className="row justify-content-around">
                        <div className="col-md-3">
                            <label className="font-weight-semibold">Placement Date: </label>
                            <input
                                name="OrderId"
                                type="text"
                                className="form-control"
                                disabled={ true }
                                value={ moment(orderDetails.placement_date).format("DD-MM-YYYY") }
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="font-weight-semibold">Delivery Date: </label>
                            <input
                                name="CustomerName"
                                type="text"
                                className="form-control"
                                disabled={ true }
                                value={ moment(orderDetails.delivery_date).format("DD-MM-YYYY") }
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="font-weight-semibold">Billed Amount: </label>
                            <input
                                name="OrderId"
                                type="text"
                                className="form-control"
                                disabled={ true }
                                value={ orderDetails.billed_amount + " AED" }
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="font-weight-semibold">Due Amount: </label>
                            <input
                                name="CustomerName"
                                type="text"
                                className="form-control"
                                disabled={ true }
                                value={ orderDetails.due_amount + " AED" }
                            />
                        </div>

                    </div>
                </CardBody>
            </Card>

            <div className="row">
                <div className="col-md-6">
                    <Card>
                        <CardBody>
                            <h6 className="font-weight-semibold">Products: </h6>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Type</th>
                                        <th>Name</th>
                                        <th>Quantity</th>
                                        <th>Unit Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        orderProducts.map((product, index) => (
                                            <tr key={ index }>
                                                <th scope="row" >{ index + 1 }</th>
                                                <td>{ product._type }</td>
                                                <td>{ product.name }</td>
                                                <td>{ product.quantity }</td>
                                                <td>{ product.unit_price + " AED" }</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </div>
                <div className="col-md-6">
                    <Card>
                        <CardBody>
                            <h6 className="font-weight-semibold">Payments: </h6>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Due Amount</th>
                                        <th>Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        paymentDetails.map((payment, index) => (
                                            <tr key={ index }>
                                                <th scope="row" >{ index + 1 }</th>
                                                <td>{ moment(payment.date_of_payment).format("DD-MM-YYYY") }</td>
                                                <td>{ payment.paid_amount + " AED" }</td>
                                                <td>{ payment.due_amount + " AED" }</td>
                                                <td>{ payment.payment_type }</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </div>
            </div>

        </Container >
    );
}
export default withRouter(Order);
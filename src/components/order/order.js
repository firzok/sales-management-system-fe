import React, { useState, useEffect } from "react";
import Container from "../common/application_container";
import axios from "axios";
import { GET_ORDER_DETAIL } from "../../config/rest_endpoints";
import { withRouter } from "react-router-dom";
import { CANCEL_ORDER, GENERATE_RECEIPT } from "../../config/rest_endpoints";
import {
  Card,
  Table,
  CardBody,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  UncontrolledTooltip,
} from "reactstrap";
import moment from "moment";
import { saveAs } from "file-saver";
import { stringify } from "querystring";

function Order(props) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [orderId, setOrderId] = useState(props.location.state.orderId);

  // ===========================Order Details==========================
  const [orderDetails, setOrderDetails] = useState({
    id: 1,
    employee_id: 1,
    customer_name: "Test",
    customer_phone_number: "+11 22 32323232",
    customer_trn: "3333232",
    advance_payment: "500",
    placement_date: "2020-04-01T19:00:00.000Z",
    order_status: "Incomplete",
    delivery_date: "2020-04-06T19:00:00.000Z",
    due_amount: "1234",
    remarks: "This is a sample order.",
    billed_amount: "1701",
    first_name: "John",
    last_name: "Legend",
  });
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [orderProducts, setOrderProducts] = useState([]);
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  // Function

  function showResponseModal(message) {
    setResponseMessage(message);
    setResponseModalOpen(true);
  }

  useEffect(() => {
    setOrderId(props.location.state.orderId);
    getOrderDetails();
  }, [props.location.state.orderId]);

  function toggleConfirmationModal() {
    setConfirmModalShow(!confirmModalShow);
  }
  function toggleResponseModal() {
    setResponseModalOpen(!responseModalOpen);
  }

  function printOrder() {
    axios(`${GENERATE_RECEIPT}`, {
      method: "POST",
      responseType: "blob", //Force to receive data in a Blob Format
      data: stringify({
        order_id: orderId,
      }),
    })
      .then((response) => {
        const file = new Blob([response.data], { type: "application/pdf" });
        saveAs(file, `Invoice for Job Order ${orderId}.pdf`);
      })
      .catch((error) => {
        showResponseModal(error);
      });
  }

  function getOrderDetails() {
    axios({
      method: "get",
      url: `${GET_ORDER_DETAIL}/${orderId}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Bearer ${user.jwt_token}`,
      },
      withCredentials: true,
    }).then((res) => {
      if (res.status === 200) {
        if (res.data.success === true) {
          const data = res.data;
          setOrderDetails(data.order);
          setPaymentDetails(data.payments);
          setOrderProducts(data.products);
        }
      } else {
        console.log("Network Error");
      }
    });
  }

  function cancelOrder() {
    toggleConfirmationModal();
    var user = JSON.parse(sessionStorage.getItem("user"));
    axios.defaults.withCredentials = true;

    axios({
      method: "get",
      url: `${CANCEL_ORDER}/${orderId}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Bearer ${user.jwt_token}`,
      },
      withCredentials: true,
    }).then((res) => {
      if (res.status === 200) {
        if (res.data.success === true) {
          showResponseModal(res.data.message);
          getOrderDetails();
        } else {
          showResponseModal(res.data.message);
        }
      } else {
        console.log("Network Error");
      }
    });
  }

  function showResponseModal(message) {
    setResponseMessage(message);
    setResponseModalOpen(true);
  }

  var responseModalHtml = (
    <Modal isOpen={responseModalOpen} toggle={toggleResponseModal}>
      <ModalHeader toggle={toggleResponseModal}>Response</ModalHeader>
      <ModalBody>{responseMessage}</ModalBody>
    </Modal>
  );

  var confirmationModalHtml = (
    <Modal isOpen={confirmModalShow} toggle={toggleConfirmationModal}>
      <ModalHeader toggle={toggleConfirmationModal}>
        Order Confirmation
      </ModalHeader>
      <ModalBody>
        <h6>
          Are you sure you want to cancel this order? This can not be undone.
        </h6>
        <div className="row">
          <Button
            outline
            color="danger"
            title="Cancel Order"
            size="lg"
            block
            onClick={() => cancelOrder()}
            disabled={orderDetails.order_status === "Cancelled"}
          >
            Yes! Cancel Order
          </Button>
          <Button
            outline
            color="success"
            title="No"
            size="lg"
            block
            onClick={() => toggleConfirmationModal()}
          >
            No
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );

  return (
    <Container header="Order Detail">
      {confirmationModalHtml}
      {responseModalHtml}
      <Card>
        <CardBody>
          <div className="row justify-content-around pb-3">
            <div className="col-md-3">
              <label className="font-weight-semibold">Order ID: </label>
              <input
                name="OrderId"
                type="text"
                className="form-control"
                disabled={true}
                value={orderId}
              />
            </div>
            <div className="col-md-3">
              <label className="font-weight-semibold">Customer Name: </label>
              <input
                name="CustomerName"
                type="text"
                className="form-control"
                disabled={true}
                value={orderDetails.customer_name}
              />
            </div>
            <div className="col-md-3">
              <label className="font-weight-semibold">Customer Number: </label>
              <input
                name="CustomerNumber"
                type="text"
                className="form-control"
                disabled={true}
                value={orderDetails.customer_phone_number}
              />
            </div>
            <div className="col-md-3">
              <label className="font-weight-semibold">Customer TRN: </label>
              <input
                name="CustomerTRN"
                type="text"
                className="form-control"
                disabled={true}
                value={orderDetails.customer_trn}
              />
            </div>
          </div>

          <div className="row justify-content-around pb-3">
            <div className="col-md-3">
              <label className="font-weight-semibold">Placement Date: </label>
              <input
                name="OrderId"
                type="text"
                className="form-control"
                disabled={true}
                value={moment(orderDetails.placement_date).format("DD-MM-YYYY")}
              />
            </div>
            <div className="col-md-3">
              <label className="font-weight-semibold">Delivery Date: </label>
              <input
                name="CustomerName"
                type="text"
                className="form-control"
                disabled={true}
                value={moment(orderDetails.delivery_date).format("DD-MM-YYYY")}
              />
            </div>
            <div className="col-md-3">
              <label className="font-weight-semibold">Billed Amount: </label>
              <input
                name="OrderId"
                type="text"
                className="form-control"
                disabled={true}
                value={orderDetails.billed_amount + " AED"}
              />
            </div>
            <div className="col-md-3">
              <label className="font-weight-semibold">Remaining Amount: </label>
              <input
                name="CustomerName"
                type="text"
                className="form-control"
                disabled={true}
                value={orderDetails.due_amount + " AED"}
              />
            </div>
          </div>

          <div className="row justify-content-around">
            <div className="col-md-3">
              <label className="font-weight-semibold">Remarks: </label>
              <textarea
                name="Remarks"
                type="text"
                className="form-control"
                disabled={true}
                value={orderDetails.remarks}
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
                  {orderProducts.map((product, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{product._type}</td>
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                      <td>{product.unit_price + " AED"}</td>
                    </tr>
                  ))}
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
                    <th>Remaining Amount</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentDetails.map((payment, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>
                        {moment(payment.date_of_payment).format("DD-MM-YYYY")}
                      </td>
                      <td>{payment.paid_amount + " AED"}</td>
                      <td>{payment.due_amount + " AED"}</td>
                      <td>{payment.payment_type}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-2 text-center">
          <Card>
            <CardBody>
              <Button
                outline
                color="success"
                size="lg"
                block
                onClick={() => printOrder()}
                id={"receiptOrderBtn"}
              >
                Order Receipt
              </Button>
              <UncontrolledTooltip placement="bottom" target="receiptOrderBtn">
                This will download order receipt.
              </UncontrolledTooltip>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-2 text-center">
          <Card>
            <CardBody>
              <Button
                outline
                color="danger"
                size="lg"
                block
                onClick={() => setConfirmModalShow(true)}
                disabled={orderDetails.order_status === "Cancelled"}
                id="cancelOrderBtn"
              >
                Cancel Order
              </Button>
              <UncontrolledTooltip placement="bottom" target="cancelOrderBtn">
                This will cancel order.
              </UncontrolledTooltip>
            </CardBody>
          </Card>
        </div>
      </div>
    </Container>
  );
}
export default withRouter(Order);

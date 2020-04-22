import React, { useState, useEffect } from "react";
import Container from "../common/application_container";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import OfflineTable from "react-offline-table";
import moment from "moment";
import axios from "axios";
import {
  ALL_ORDERS,
  UPDATE_DELIVERY_DATE,
  GET_ALL_EMPLOYEES,
  ADD_ORDER_PAYMENT
} from "../../config/rest_endpoints";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { stringify } from "querystring";
import { convertDate } from "../helper";
import {
  colors,
  pages,
  monthListWithAllMonthOption
} from "../../config/static_lists";
import { range } from "../helper";
import CurrencyInput from "react-currency-input";
import { ORDER } from "../router/routeConstants";
import BeatLoader from "react-spinners/BeatLoader";
import { getFullName } from "../helper";
import { cashDisposalTypes } from "../../config/static_lists";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AllOrders(props) {
  useEffect(() => {
    if (isAdmin) {
      getAllEmployees();
    }
  }, []);

  const user = JSON.parse(sessionStorage.getItem("user"));

  const isAdmin = user.role === "admin";

  const currentDate = new Date();

  const allEmployeeObj = { id: 0, first_name: "All", last_name: "Employees" };

  // State
  const [orderList, setOrderList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [gettingData, setGettingData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [dateUpdated, setDateUpdated] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [dropDownEmployeeOpen, setDropDownEmployeeOpen] = useState(false);
  const [dropDownMonthOpen, setDropDownMonthOpen] = useState(false);
  const [dropDownYearOpen, setDropDownYearOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(allEmployeeObj);
  const [selectedMonth, setSelectedMonth] = useState(
    monthListWithAllMonthOption[currentDate.getMonth() + 1]
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [receivedPaymentAmount, setReceivedPaymentAmount] = useState(0);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [dropdownCashDisposal, setDropdownCashDisposal] = useState(false);
  const [selectedCashDisposal, setSelectedCashDisposal] = useState("Disposal");
  const [chequeNumber, setChequeNumber] = useState("");

  // Function
  const toggleCashDisposal = () =>
    setDropdownCashDisposal(prevState => !prevState);

  function receivePayment() {
    const data = {
      order_id: orderId,
      paid_amount: receivedPaymentAmount,
      disposal: selectedCashDisposal,
      cheque: chequeNumber
    };

    axios({
      method: "post",
      url: ADD_ORDER_PAYMENT,
      data: stringify(data),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Bearer ${user.jwt_token}`
      },
      withCredentials: true
    }).then(res => {
      if (res.status === 200) {
        if (res.data.success === true) {
          setPaymentModalOpen(false);
          getFilteredData();
        }
        showResponseModal(res.data.message);
      } else {
        console.log("Network Error");
      }
    });
  }

  function showResponseModal(message) {
    setResponseMessage(message);
    setResponseModalOpen(true);
  }

  function getFilteredData() {
    const filterData = {
      employee_id: selectedEmployee.id,
      month: selectedMonth.id,
      year: selectedYear
    };

    getAllOrder(filterData);
  }

  function selectYear(year) {
    setSelectedYear(year);
  }

  function selectMonth(month) {
    setSelectedMonth(month);
  }

  function selectEmployee(employee) {
    setSelectedEmployee(employee);
  }

  const toggleEmployeeDropdown = () =>
    setDropDownEmployeeOpen(prevState => !prevState);

  const toggleMonthDropdown = () =>
    setDropDownMonthOpen(prevState => !prevState);

  const toggleYearDropdown = () => setDropDownYearOpen(prevState => !prevState);

  function getAllOrder(filterData) {
    setOrderList([]);
    setGettingData(true);
    axios({
      method: "post",
      url: ALL_ORDERS,
      data: stringify(filterData),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Bearer ${user.jwt_token}`
      },
      withCredentials: true
    }).then(res => {
      setGettingData(false);
      if (res.status === 200) {
        if (res.data.success === true) {
          if (res.data.rows.length > 0) {
            setOrderList(res.data.rows);
          } else {
            showResponseModal(res.data.message);
          }
        } else {
          showResponseModal(res.data.message);
        }
      } else {
        console.log("Network Error");
      }
    });
  }

  function updateOrder() {
    axios({
      method: "post",
      url: UPDATE_DELIVERY_DATE,
      data: stringify({
        order_id: orderId,
        newDate: convertDate(deliveryDate)
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Bearer ${user.jwt_token}`
      },
      withCredentials: true
    }).then(res => {
      if (res.status === 200) {
        if (res.data.success === true) {
          setOpenModal(false);
          setOrderList([]);
          setDateUpdated(false);
          setDeliveryDate("");
          setOrderDate("");

          getAllOrder();
        } else {
          showResponseModal(res.data.message);
        }
      } else {
        console.log("Network Error");
      }
    });
  }

  function togglePaymentModal() {
    setPaymentModalOpen(!paymentModalOpen);
  }

  function toggleModal() {
    setOpenModal(!openModal);
  }

  function toggleResponseModal() {
    setResponseModalOpen(!responseModalOpen);
  }

  function openEditOrderModal(order) {
    setOrderDate(new Date(order.placement_date));
    setDeliveryDate(new Date(order.delivery_date));
    setOrderId(order.id);

    setOpenModal(true);
  }

  function openReceivePaymentModal(order) {
    setOrderId(order.id);

    setPaymentModalOpen(true);
  }

  function getAllEmployees() {
    setGettingData(true);
    axios({
      method: "get",
      url: GET_ALL_EMPLOYEES,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Bearer ${user.jwt_token}`
      },
      withCredentials: true
    }).then(res => {
      setGettingData(false);
      if (res.status === 200) {
        if (res.data.success === true) {
          setEmployeeList([allEmployeeObj, ...res.data.rows]);
        } else {
          showResponseModal(res.data.message);
        }
      } else {
        console.log("Network Error");
      }
    });
  }

  // Data
  const headerFields = [
    {
      id: 0,
      type: "action",
      sort: "sorting_asc",
      align: "text-left",
      name: "ACTIONS"
    },
    {
      id: 2,
      type: "text",
      sort: "sorting",
      align: "text-left",
      name: "ORDER#"
    },
    {
      id: 1,
      type: "text",
      align: "text-left",
      name: "TOTAL AMOUNT"
    },
    {
      id: 3,
      type: "media",
      sort: "sorting",
      align: "text-left",
      name: "EMPLOYEE"
    },
    {
      id: 4,
      type: "media",
      sort: "sorting",
      align: "text-left",
      name: "CUSTOMER"
    },
    {
      id: 5,
      type: "text",
      sort: "sorting",
      align: "text-left",
      name: "ORDER DATE"
    },
    {
      id: 6,
      type: "text",
      sort: "sorting",
      align: "text-left",
      name: "DELIVERY DATE"
    },
    {
      id: 7,
      type: "text",
      sort: "sorting",
      align: "text-left",
      name: "REMAINING AMOUNT"
    },
    {
      id: 8,
      type: "badge",
      sort: "sorting",
      align: "text-left",
      name: "STATUS"
    }
  ];

  const yearList = range(2015, currentDate.getFullYear());

  var _data = [];

  for (var i = 0; i < orderList.length; i++) {
    var row = [];

    const currentOrder = orderList[i];
    var formatter = new Intl.NumberFormat("en-US");

    // Column ACTIONS
    const actions = [];

    if (orderList[i].order_status !== "Cancelled") {
      actions.push({
        icon: ["far", "edit"],
        className: "text-info-600 cursor-pointer h3",
        callBack: () => openEditOrderModal(currentOrder)
      });
    }

    if (orderList[i].order_status === "Incomplete") {
      actions.push({
        icon: ["fas", "hand-holding-usd"],
        className: "text-info-600 cursor-pointer h3 ml-2",
        callBack: () => openReceivePaymentModal(currentOrder)
      });
    }
    actions.push({
      icon: ["fas", "info-circle"],
      className: "text-info-600 cursor-pointer h3 ml-2",
      callBack: () => {
        setOrderId(currentOrder.id);
        props.history.push({
          pathname: `${ORDER}`,
          state: { orderId: currentOrder.id }
        });
      }
    });
    row.push(actions);

    // Column ORDER#
    row.push(orderList[i].id ? orderList[i].id : "N/A");

    // Column TOTAL PAYMENT
    row.push(String(formatter.format(currentOrder.billed_amount) + " AED"));

    // Column EMPLOYEE
    const employeeAvatar = {
      topText: String(orderList[i].first_name + " " + orderList[i].last_name),
      bottomText: String(orderList[i].employee_id),
      picture: null
    };
    row.push(employeeAvatar);

    // Column CUSTOMER
    const customerAvatar = {
      topText: String(orderList[i].customer_name),
      bottomText: String(orderList[i].customer_phone_number),
      picture: null
    };
    row.push(customerAvatar);

    // Column ORDER DATE
    row.push(
      orderList[i].placement_date === "" || orderList[i].placement_date === null
        ? "N/A"
        : moment(orderList[i].placement_date).format("DD-MM-YYYY")
    );

    // Column DELIVERY DATE
    row.push(
      orderList[i].delivery_date === "" || orderList[i].delivery_date === null
        ? "N/A"
        : moment(orderList[i].delivery_date).format("DD-MM-YYYY")
    );

    // Column DUE PAYMENT
    row.push(String(formatter.format(orderList[i].due_amount) + " AED"));

    // Column STATUS BADGE
    if (orderList[i].order_status === "Incomplete") {
      row.push({
        class: "badge badge-info text-capitalize",
        data: "Incomplete"
      });
    } else if (orderList[i].order_status === "Complete") {
      row.push({
        class: "badge badge-success text-capitalize",
        data: "Complete"
      });
    } else if (orderList[i].order_status === "Cancelled") {
      row.push({
        class: "badge badge-danger text-capitalize",
        data: "Cancelled"
      });
    }
    row.push();

    _data.push(row);
  }
  var editOrderModalHtml = (
    <Modal isOpen={openModal} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Change Delivery Date</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label className="font-weight-semibold">
            Delivery Date{" "}
            <span className="c-failed" title="Required">
              *
            </span>
          </label>

          <DatePicker
            className="form-control"
            dateFormat="MMMM d, yyyy"
            selected={deliveryDate}
            onChange={date => {
              setDeliveryDate(date);
              setDateUpdated(true);
            }}
            todayButton="Today"
            minDate={orderDate}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          title="Update"
          className="btn btn-theme btn-labeled"
          onClick={() => updateOrder()}
          disabled={!dateUpdated}
        >
          Update
        </Button>
      </ModalFooter>
    </Modal>
  );

  var responseModalHtml = (
    <Modal isOpen={responseModalOpen} toggle={toggleResponseModal}>
      <ModalHeader toggle={toggleResponseModal}>Response</ModalHeader>
      <ModalBody>{responseMessage}</ModalBody>
    </Modal>
  );

  var receivePaymentModal = (
    <Modal isOpen={paymentModalOpen} toggle={togglePaymentModal}>
      <ModalHeader toggle={togglePaymentModal}>
        Receive payment for order
      </ModalHeader>
      <ModalBody>
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <label className="font-weight-semibold">
                New Payment{" "}
                <span className="c-failed" title="Required">
                  *
                </span>
              </label>

              <CurrencyInput
                className="form-control"
                suffix=" AED"
                precision="0"
                value={receivedPaymentAmount}
                onChangeEvent={(event, value, maskedValue) =>
                  setReceivedPaymentAmount(maskedValue)
                }
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <Dropdown
                isOpen={dropdownCashDisposal}
                toggle={toggleCashDisposal}
              >
                <DropdownToggle caret className="btn btn-theme btn-labeled">
                  {selectedCashDisposal}
                </DropdownToggle>
                <DropdownMenu style={{ overflow: "auto", maxHeight: "20vh" }}>
                  {cashDisposalTypes.map((type, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => setSelectedCashDisposal(type)}
                    >
                      {type}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <div className="col-md-6 text-right">
            <input
              disabled={selectedCashDisposal !== "Bank"}
              name="Cheque"
              type="text"
              className="form-control"
              placeholder="Cheque Number"
              value={chequeNumber}
              onChange={event => setChequeNumber(event.target.value)}
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          title="Update"
          className="btn btn-theme btn-labeled"
          onClick={() => receivePayment()}
          disabled={receivedPaymentAmount === 0}
        >
          Update
        </Button>
      </ModalFooter>
    </Modal>
  );

  return (
    <Container header="All Orders">
      {editOrderModalHtml}
      {responseModalHtml}
      {receivePaymentModal}
      <div className="card">
        <div className="card-body">
          <div className="row justify-content-between">
            {isAdmin ? (
              <div className="col-md-3">
                <Dropdown
                  isOpen={dropDownEmployeeOpen}
                  toggle={toggleEmployeeDropdown}
                >
                  <DropdownToggle
                    caret
                    className="btn btn-theme btn-labeled w-100 text-right"
                  >
                    {getFullName(selectedEmployee)}
                  </DropdownToggle>
                  <DropdownMenu
                    style={{ overflow: "auto", maxHeight: "20vh" }}
                    right
                  >
                    {employeeList.map(employee => (
                      <DropdownItem
                        key={employee.id}
                        onClick={() => {
                          selectEmployee(employee);
                        }}
                      >
                        {getFullName(employee)}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
            ) : (
              ""
            )}

            <div className="col-md-3">
              <Dropdown isOpen={dropDownMonthOpen} toggle={toggleMonthDropdown}>
                <DropdownToggle
                  caret
                  className="btn btn-theme btn-labeled w-100 text-right"
                >
                  {selectedMonth.name}
                </DropdownToggle>
                <DropdownMenu
                  style={{ overflow: "auto", maxHeight: "20vh" }}
                  right
                >
                  {monthListWithAllMonthOption.map(month => (
                    <DropdownItem
                      key={month.id}
                      onClick={() => {
                        selectMonth(month);
                      }}
                    >
                      {month.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className="col-md-3">
              <Dropdown isOpen={dropDownYearOpen} toggle={toggleYearDropdown}>
                <DropdownToggle
                  caret
                  className="btn btn-theme btn-labeled w-100 text-right"
                >
                  {selectedYear}
                </DropdownToggle>
                <DropdownMenu
                  style={{ overflow: "auto", maxHeight: "20vh" }}
                  right
                >
                  {yearList.map(year => (
                    <DropdownItem
                      key={year}
                      onClick={() => {
                        selectYear(year);
                      }}
                    >
                      {year}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className="col-md-3">
              <Button
                title="Filter Data"
                className="btn btn-theme btn-labeled w-100"
                onClick={() => getFilteredData()}
              >
                <FontAwesomeIcon icon={["fas", "filter"]} className="mr-2" />
                Filter Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {_data.length > 0 ? (
        <div className="card">
          <div className="card-body">
            <OfflineTable
              headerFields={headerFields}
              data={_data}
              showSno={false}
              enableFilter={true}
              pages={pages}
              colors={colors}
            />
          </div>
        </div>
      ) : (
        <div className="h-100 row align-items-center">
          <div className="text-center col mb-5 pb-5">
            <BeatLoader color={"#1861B8"} size={20} loading={gettingData} />
          </div>
        </div>
      )}
    </Container>
  );
}
export default AllOrders;

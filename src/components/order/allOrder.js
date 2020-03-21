import React, { useState, useEffect } from "react";
import Container from "../common/application_container";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card
} from "reactstrap";
import OfflineTable from "react-offline-table";
import moment from "moment";
import axios from "axios";
import {
  ALL_ORDERS,
  UPDATE_DELIVERY_DATE,
  GET_ALL_EMPLOYEES
} from "../../config/rest_endpoints";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import DatePicker from "react-datepicker";
import { addDays, subDays } from "date-fns";
import { stringify } from "querystring";
import { convertDate } from "../helper";
import { colors, pages, monthList } from "../../config/static_lists";
import { range } from "../helper";

function AllOrders(props) {
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
    monthList[currentDate.getMonth()]
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  // Function

  function showResponseModal(message) {
    setResponseMessage(message);
    setResponseModalOpen(true);
  }

  function getFilteredData() {
    const filterData = {
      employee: selectedEmployee.id,
      month: selectedMonth.id,
      year: selectedYear
    };

    getAllOrder(filterData);
  }

  function getFullName(employee) {
    return employee.first_name + " " + employee.last_name;
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
      setGettingData(true);
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

  useEffect(() => {
    if (isAdmin) {
      getAllEmployees();
    }
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

  const yearList = range(2015, currentDate.getFullYear());

  var _data = [];

  for (var i = 0; i < orderList.length; i++) {
    var row = [];

    const currentOrder = orderList[i];
    // Column 1 ACTIONS
    const actions = [
      {
        icon: ["far", "edit"],
        className: "text-info-800 cursor-pointer",
        callBack: () => openEditOrderModal(currentOrder)
      }
    ];
    row.push(actions);

    // Column 2 ORDER#
    row.push(orderList[i].id ? orderList[i].id : "N/A");

    // Column 3 EMPLOYEE
    const employeeAvatar = {
      topText: String(orderList[i].first_name + " " + orderList[i].last_name),
      bottomText: String(orderList[i].employee_id),
      picture: null
    };
    row.push(employeeAvatar);

    // Column 4 CUSTOMER
    const customerAvatar = {
      topText: String(orderList[i].customer_name),
      bottomText: String(orderList[i].customer_phone_number),
      picture: null
    };
    row.push(customerAvatar);

    // Column 5 ORDER DATE
    row.push(
      orderList[i].placement_date === "" || orderList[i].placement_date === null
        ? "N/A"
        : moment(orderList[i].placement_date).format("DD-MM-YYYY")
    );

    // Column 6 DELIVERY DATE
    row.push(
      orderList[i].delivery_date === "" || orderList[i].delivery_date === null
        ? "N/A"
        : moment(orderList[i].delivery_date).format("DD-MM-YYYY")
    );

    // Column 7 ADVANCE PAYMENT
    var formatter = new Intl.NumberFormat("en-US");
    row.push(String(formatter.format(orderList[i].advance_payment) + " AED"));

    _data.push(row);
  }
  var modalHtml = (
    <Modal
      isOpen={openModal}
      toggle={toggleModal}
      // className={ }
    >
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

  return (
    <Container header="All Orders">
      {modalHtml}
      {responseModalHtml}
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
                  <DropdownMenu right>
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
                <DropdownMenu right>
                  {monthList.map(month => (
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
                <DropdownMenu right>
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
            <div className="col-md-2">
              <Button
                title="Filter Data"
                className="btn btn-theme btn-labeled"
                onClick={() => getFilteredData()}
              >
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
        ""
      )}
    </Container>
  );
}
export default AllOrders;

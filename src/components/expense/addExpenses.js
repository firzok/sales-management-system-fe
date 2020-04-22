import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  UncontrolledTooltip
} from "reactstrap";

import { expenseTypes } from "../../config/static_lists";
import CurrencyInput from "react-currency-input";
import DatePicker from "react-datepicker";
import axios from "axios";
import {
  ADD_EXPENSE,
  GET_ALL_EMPLOYEES,
  GET_ALL_VEHICLE_NUMBERS
} from "../../config/rest_endpoints";
import { stringify } from "querystring";
import { convertDate, getFullName } from "../helper";

function AddExpenses(props) {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [dropDownExpenseType, setDropDownExpenseType] = useState(false);
  const [dropDownVehicleNumber, setDropDownVehicleNumber] = useState(false);

  const [dropDownEmployee, setDropDownEmployee] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [vehicleNumberArray, setVehicleNumberArray] = useState([]);

  const [expenseAmount, setExpenseAmount] = useState(0);
  const [cashOnHand, setCashOnHand] = useState(0);

  const [expenseDate, setExpenseDate] = useState(new Date());
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [description, setDescription] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [vehicleNumberSelected, setVehicleNumberSelected] = useState(
    "Select Vehicle Number"
  );

  const [expenseTypeSelected, setExpenseTypeSelected] = useState(
    "Select Expense Type"
  );

  const [employeeSelected, setEmployeeSelected] = useState({
    first_name: "Select",
    last_name: "Employee"
  });

  useEffect(() => {
    if (user.role === "admin") {
      getAllEmployees();
    }
    getVehicleNumbers();
  }, []);

  function getVehicleNumbers() {
    axios({
      method: "get",
      url: GET_ALL_VEHICLE_NUMBERS,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Bearer ${user.jwt_token}`
      },
      withCredentials: true
    }).then(res => {
      if (res.status === 200) {
        if (res.data.success === true) {
          setVehicleNumberArray(res.data.rows);
        } else {
          showResponseModal(res.data.message);
        }
      } else {
        console.log("Network Error");
      }
    });
  }

  function getAllEmployees() {
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
      if (res.status === 200) {
        if (res.data.success === true) {
          setEmployeeList(res.data.rows);
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
  function toggleResponseModal() {
    setResponseModalOpen(!responseModalOpen);
  }

  const toggleDropDownExpenseType = () =>
    setDropDownExpenseType(prevState => !prevState);

  const toggleDropDownVehicleNumber = () =>
    setDropDownVehicleNumber(prevState => !prevState);

  const toggleDropDownEmployee = () =>
    setDropDownEmployee(prevState => !prevState);

  function reset() {}

  function addExpense() {
    const data = {
      employee_id: user.role === "admin" ? employeeSelected.id : user.empID,
      date_added: convertDate(expenseDate),
      amount_spent: expenseAmount,
      cash_on_hand: cashOnHand,
      expense_type: expenseTypeSelected,
      bill_number: billNumber
    };
    if (expenseTypeSelected === "Vehicle" || expenseTypeSelected === "Petrol") {
      data["vehicle_id"] = vehicleNumberSelected;
    }
    if (expenseTypeSelected === "Other") {
      data["description"] = description;
    }

    axios({
      method: "post",
      url: ADD_EXPENSE,
      data: stringify(data),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Bearer ${user.jwt_token}`
      },
      withCredentials: true
    }).then(res => {
      if (res.status === 200) {
        showResponseModal(res.data.message);
        reset();
      } else {
        console.log("Network Error");
      }
    });
  }

  var responseModalHtml = (
    <Modal isOpen={responseModalOpen} toggle={toggleResponseModal}>
      <ModalHeader toggle={toggleResponseModal}>Response</ModalHeader>
      <ModalBody>{responseMessage}</ModalBody>
    </Modal>
  );

  return (
    <div>
      {responseModalHtml}
      <Card>
        <CardBody>
          <h4 className="card-title">Add Expense</h4>
          <div className="row justify-content-around">
            {user.role === "admin" ? (
              <div className="col-md-2">
                <Dropdown
                  isOpen={dropDownEmployee}
                  toggle={toggleDropDownEmployee}
                >
                  <DropdownToggle
                    caret
                    className="btn btn-theme btn-labeled text-right w-100"
                  >
                    {getFullName(employeeSelected)}
                  </DropdownToggle>
                  <DropdownMenu
                    style={{ overflow: "auto", maxHeight: "20vh" }}
                    className="w-100"
                  >
                    {employeeList.map((employee, index) => (
                      <DropdownItem
                        key={index}
                        onClick={() => setEmployeeSelected(employee)}
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

            <div className="col-md-2">
              <Dropdown
                isOpen={dropDownExpenseType}
                toggle={toggleDropDownExpenseType}
              >
                <DropdownToggle
                  caret
                  className="btn btn-theme btn-labeled text-right w-100"
                >
                  {expenseTypeSelected}
                </DropdownToggle>
                <DropdownMenu
                  style={{ overflow: "auto", maxHeight: "20vh" }}
                  className="w-100"
                >
                  {expenseTypes.map((type, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => setExpenseTypeSelected(type)}
                    >
                      {type}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>

            {expenseTypeSelected === "Vehicle" ||
            expenseTypeSelected === "Petrol" ? (
              <div className="col-md-2">
                <Dropdown
                  isOpen={dropDownVehicleNumber}
                  toggle={toggleDropDownVehicleNumber}
                >
                  <DropdownToggle
                    caret
                    className="btn btn-theme btn-labeled text-right w-100"
                  >
                    {vehicleNumberSelected}
                  </DropdownToggle>
                  <DropdownMenu
                    style={{ overflow: "auto", maxHeight: "20vh" }}
                    className="w-100"
                  >
                    {vehicleNumberArray.map((vehicle, index) => (
                      <DropdownItem
                        key={index}
                        onClick={() => setVehicleNumberSelected(vehicle.id)}
                      >
                        {vehicle.vehicle_number}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
            ) : (
              ""
            )}

            {expenseTypeSelected === "Other" ? (
              <div className="col-md-2">
                <input
                  disabled={expenseTypeSelected !== "Other"}
                  name="Description"
                  id="Description"
                  type="text"
                  className="form-control"
                  placeholder="Description"
                  value={description}
                  onChange={event => setDescription(event.target.value)}
                />
                <UncontrolledTooltip placement="bottom" target="Description">
                  Description
                </UncontrolledTooltip>
              </div>
            ) : (
              ""
            )}

            <div className="col-md-2">
              <CurrencyInput
                className="form-control"
                id="cashOnHand"
                suffix=" AED"
                precision="0"
                value={cashOnHand}
                onChangeEvent={(event, value, maskedValue) =>
                  setCashOnHand(maskedValue)
                }
              />
              <UncontrolledTooltip placement="bottom" target="cashOnHand">
                Cash On Hand
              </UncontrolledTooltip>
            </div>
            <div className="col-md-2">
              <CurrencyInput
                className="form-control"
                id="expenseAmount"
                suffix=" AED"
                precision="0"
                value={expenseAmount}
                onChangeEvent={(event, value, maskedValue) =>
                  setExpenseAmount(maskedValue)
                }
              />
              <UncontrolledTooltip placement="bottom" target="expenseAmount">
                Expense Amount
              </UncontrolledTooltip>
            </div>
            <div className="col-md-2">
              <DatePicker
                className="form-control"
                id="expenseDate"
                dateFormat="MMMM d, yyyy"
                selected={expenseDate}
                onChange={date => {
                  setExpenseDate(date);
                }}
                todayButton="Today"
              />
              <UncontrolledTooltip placement="bottom" target="expenseDate">
                Expense Date
              </UncontrolledTooltip>
            </div>
          </div>
          <div className="row pt-4 justify-content-end">
            <div className="col-md-2">
              <input
                name="Bill number"
                id="Bill"
                type="text"
                className="form-control"
                placeholder="Bill number"
                value={billNumber}
                onChange={event => setBillNumber(event.target.value)}
              />
              <UncontrolledTooltip placement="bottom" target="Bill">
                Bill number
              </UncontrolledTooltip>
            </div>
            <div className="col-md-3">
              <Button
                title="Add"
                className="btn btn-theme btn-labeled w-100"
                onClick={() => addExpense()}
                disabled={
                  expenseAmount === 0 ||
                  expenseTypeSelected === "Select Expense Type" ||
                  (user.role === "admin" &&
                    employeeSelected.first_name === "Select") ||
                  ((expenseTypeSelected === "Vehicle" ||
                    expenseTypeSelected === "Petrol") &&
                    vehicleNumberSelected === "Select Vehicle Number")
                }
              >
                Add Expense
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
export default AddExpenses;

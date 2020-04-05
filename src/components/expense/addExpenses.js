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
} from "reactstrap";

import { expenseTypes } from "../../config/static_lists";
import CurrencyInput from "react-currency-input";
import DatePicker from "react-datepicker";
import axios from "axios";
import { ADD_EXPENSE, GET_ALL_EMPLOYEES } from "../../config/rest_endpoints";
import { stringify } from "querystring";
import { convertDate, getFullName } from "../helper";

function AddExpenses(props) {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [dropDownExpenseType, setDropDownExpenseType] = useState(false);
  const [dropDownEmployee, setDropDownEmployee] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);

  const [expenseAmount, setExpenseAmount] = useState(0);
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const [expenseTypeSelected, setExpenseTypeSelected] = useState(
    "Select Expense Type"
  );

  const [employeeSelected, setEmployeeSelected] = useState({
    first_name: "Select",
    last_name: "Employee",
  });

  useEffect(() => {
    if (user.role === "admin") {
      getAllEmployees();
    }
  }, []);

  function getAllEmployees() {
    axios({
      method: "get",
      url: GET_ALL_EMPLOYEES,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Bearer ${user.jwt_token}`,
      },
      withCredentials: true,
    }).then((res) => {
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
    setDropDownExpenseType((prevState) => !prevState);

  const toggleDropDownEmployee = () =>
    setDropDownEmployee((prevState) => !prevState);

  function addExpense() {
    const data = {
      employee_id: user.role === "admin" ? employeeSelected.id : user.empID,
      date_added: convertDate(expenseDate),
      amount_spent: expenseAmount,
      expenditure_type: expenseTypeSelected,
    };

    axios({
      method: "post",
      url: ADD_EXPENSE,
      data: stringify(data),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Bearer ${user.jwt_token}`,
      },
      withCredentials: true,
    }).then((res) => {
      if (res.status === 200) {
        showResponseModal(res.data.message);
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
          <div className="row justify-content-center">
            {user.role === "admin" ? (
              <div className="col-md-3">
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
                  <DropdownMenu className="w-100">
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

            <div className="col-md-3">
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
                <DropdownMenu className="w-100">
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
            <div className="col-md-3">
              <CurrencyInput
                className="form-control"
                suffix=" AED"
                precision="0"
                value={expenseAmount}
                onChangeEvent={(event, value, maskedValue) =>
                  setExpenseAmount(maskedValue)
                }
              />
            </div>
            <div className="col-md-3">
              <DatePicker
                className="form-control"
                dateFormat="MMMM d, yyyy"
                selected={expenseDate}
                onChange={(date) => {
                  setExpenseDate(date);
                }}
                todayButton="Today"
              />
            </div>
          </div>
          <div className="row pt-4 justify-content-end">
            <div className="col-md-3">
              <Button
                title="Add"
                className="btn btn-theme btn-labeled w-100"
                onClick={() => addExpense()}
                disabled={expenseAmount === 0}
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

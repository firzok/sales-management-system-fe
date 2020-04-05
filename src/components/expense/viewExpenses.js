import React, { useState, useEffect } from "react";
import Container from "../common/application_container";
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
import { convertDate, getFullName } from "../helper";
import axios from "axios";
import { GET_ALL_EMPLOYEES, GET_EXPENSES } from "../../config/rest_endpoints";
import DatePicker from "react-datepicker";
import { byType } from "../../config/static_lists";
import { stringify } from "querystring";

function ViewExpenses(props) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const allEmployeeObj = { id: 0, first_name: "All", last_name: "Employees" };

  const [dropDownEmployee, setDropDownEmployee] = useState(false);
  const [dropDownByType, setDropDownByType] = useState(false);

  const [employeeList, setEmployeeList] = useState([]);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [employeeSelected, setEmployeeSelected] = useState(allEmployeeObj);
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [byTypeSelected, setByTypeSelected] = useState(byType[0]);

  const [expensesList, setExpensesList] = useState([]);

  useEffect(() => {
    getAllEmployees();
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
          setEmployeeList([allEmployeeObj, ...res.data.rows]);
        } else {
          showResponseModal(res.data.message);
        }
      } else {
        console.log("Network Error");
      }
    });
  }

  function getExpenses() {
    const data = {
      employee_id: employeeSelected.id,
      date: convertDate(expenseDate),
      expenditure_type: byTypeSelected,
    };

    axios({
      method: "post",
      url: GET_EXPENSES,
      data: stringify(data),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Bearer ${user.jwt_token}`,
      },
      withCredentials: true,
    }).then((res) => {
      if (res.status === 200) {
        if (res.data.success === true) {
          setExpensesList(res.data.rows);
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

  const toggleDropDownEmployee = () =>
    setDropDownEmployee((prevState) => !prevState);

  const toggleDropDownByType = () =>
    setDropDownByType((prevState) => !prevState);

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
          <h4 className="card-title">View Expenses</h4>

          <div className="row">
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
            <div className="col-md-3">
              <Dropdown isOpen={dropDownByType} toggle={toggleDropDownByType}>
                <DropdownToggle
                  caret
                  className="btn btn-theme btn-labeled text-right w-100"
                >
                  {byTypeSelected}
                </DropdownToggle>
                <DropdownMenu className="w-100">
                  {byType.map((bt, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => setByTypeSelected(bt)}
                    >
                      {bt}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className="col-md-3">
              <Button
                title="Add"
                className="btn btn-theme btn-labeled w-100"
                onClick={() => getExpenses()}
              >
                Get Expenses
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
export default ViewExpenses;

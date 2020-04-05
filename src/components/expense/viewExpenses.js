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
import { byType, pages, colors } from "../../config/static_lists";
import { stringify } from "querystring";
import BeatLoader from "react-spinners/BeatLoader";
import OfflineTable from "react-offline-table";
import moment from "moment";

function ViewExpenses(props) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const allEmployeeObj = { id: 0, first_name: "All", last_name: "Employees" };

  const [gettingData, setGettingData] = useState(false);
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

  useEffect(() => {
    getAllEmployees();
    getExpenses();
  }, [props]);

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
    setGettingData(true);
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
    })
      .then((res) => {
        setGettingData(false);
        if (res.status === 200) {
          if (res.data.success === true) {
            setExpensesList(res.data.rows);
          } else {
            showResponseModal(res.data.message);
          }
        } else {
          console.log("Network Error");
        }
      })
      .catch(() => {
        setGettingData(false);
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

  // Table Data
  const headerFields = [
    {
      id: 0,
      type: "text",
      align: "text-left",
      name: "DATE ADDED",
    },
    {
      id: 1,
      type: "text",
      sort: "sorting_asc",
      align: "text-left",
      name: "EXPENSE TYPE",
    },
    {
      id: 2,
      type: "text",
      sort: "sorting",
      align: "text-left",
      name: "EXPENSE AMOUNT",
    },
    {
      id: 3,
      type: "media",
      sort: "sorting",
      align: "text-left",
      name: "EMPLOYEE NAME",
    },
  ];

  let expensesData = [];

  for (var i = 0; i < expensesList.length; i++) {
    var row = [];

    // Date
    row.push(
      expensesList[i].date === "" || expensesList[i].date === null
        ? "N/A"
        : moment(expensesList[i].date).format("DD-MM-YYYY")
    );

    // Type
    row.push(expensesList[i].type);

    // Amount
    var formatter = new Intl.NumberFormat("en-US");
    row.push(String(formatter.format(expensesList[i].amount) + " AED"));

    // Employee
    const employeeAvatar = {
      topText: String(expensesList[i].employee_name),
      bottomText: String(expensesList[i].employee_id),
      picture: null,
    };
    row.push(employeeAvatar);

    expensesData.push(row);
  }

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

          <div className="row">
            {expensesData.length > 0 ? (
              <div className="card">
                <div className="card-body">
                  <OfflineTable
                    headerFields={headerFields}
                    data={expensesData}
                    showSno={true}
                    enableFilter={true}
                    pages={pages}
                    colors={colors}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center col mt-5">
                <BeatLoader color={"#1861B8"} size={20} loading={gettingData} />
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
export default ViewExpenses;

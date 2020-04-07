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
  Table,
} from "reactstrap";
import { convertDate, getFullName } from "../helper";
import axios from "axios";
import { GET_ALL_EMPLOYEES, GET_EXPENSES } from "../../config/rest_endpoints";
import DatePicker from "react-datepicker";
import { byType, pages, colors } from "../../config/static_lists";
import { stringify } from "querystring";
import BeatLoader from "react-spinners/BeatLoader";
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
    if (user.role === "admin") {
      getAllEmployees();
    }
  }, []);

  useEffect(() => {
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
      employee_id: user.role === "admin" ? employeeSelected.id : user.empID,
      date: convertDate(expenseDate),
      sort_by: byTypeSelected,
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

  return (
    <div>
      {responseModalHtml}
      <Card>
        <CardBody>
          <h4 className="card-title">View Expenses</h4>

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
            {expensesList.length > 0 ? (
              <div className="card-body">
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>DATE ADDED</th>
                      <th>EXPENSE TYPE</th>
                      <th>EXPENSE AMOUNT</th>
                      <th>EMPLOYEE NAME</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expensesList.map((expense, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>
                          {moment(expense.date_added).format("DD-MM-YYYY")}
                        </td>
                        <td>{expense.expenditure_type}</td>
                        <td>{expense.amount_spent + " AED"}</td>
                        <td>{expense.employee}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
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

import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import OfflineTable from "react-offline-table";
import axios from "axios";
import {
  GET_ALL_EMPLOYEES,
  EMPLOYEE_TOTALS,
  GENERATE_CASH_REPORT,
  GENERATE_LEDGER_REPORT
} from "../../config/rest_endpoints";
import { saveAs } from "file-saver";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledTooltip
} from "reactstrap";
import "react-datepicker/dist/react-datepicker.css";
import { stringify } from "querystring";
import {
  colors,
  pages,
  monthListWithAllMonthOption
} from "../../config/static_lists";
import { range, getFullName, convertDate } from "../helper";
import BeatLoader from "react-spinners/BeatLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";

function DashboardAdmin(props) {
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
  const [jobOrderList, setJobOrderList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [gettingData, setGettingData] = useState(false);
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
  const [reportType, setReportType] = useState("");
  const [reportDate, setReportDate] = useState(new Date());

  // Function

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

    getAllJobOrder(filterData);
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

  function getAllJobOrder(filterData) {
    setJobOrderList([]);
    setGettingData(true);
    axios({
      method: "post",
      url: EMPLOYEE_TOTALS,
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
            setJobOrderList(res.data.rows);
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

  function toggleResponseModal() {
    setResponseModalOpen(!responseModalOpen);
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
      type: "text",
      align: "text-left",
      sort: "sorting_asc",
      name: "EMPLOYEE NAME"
    },
    {
      id: 1,
      type: "text",
      sort: "sorting",
      align: "text-left",
      name: "TOTAL BILLED"
    },
    {
      id: 2,
      type: "text",
      sort: "sorting",
      align: "text-left",
      name: "TOTAL RECEIVED"
    },
    {
      id: 3,
      type: "text",
      sort: "sorting",
      align: "text-left",
      name: "TOTAL REMAINING"
    }
  ];

  const yearList = range(2015, currentDate.getFullYear());

  var _data = [];

  for (var i = 0; i < jobOrderList.length; i++) {
    var row = [];

    const currentJobOrder = jobOrderList[i];
    // Column 1 Employee

    row.push(currentJobOrder.employee_name);

    // Column 2 Total Billed
    var formatter = new Intl.NumberFormat("en-US");

    row.push(
      String(formatter.format(currentJobOrder.total_billed_amount)) + " AED"
    );

    // Column 3 Total Received
    row.push(
      String(formatter.format(currentJobOrder.total_received_amount)) + " AED"
    );

    // Column 4 Total Remaining
    row.push(
      String(formatter.format(currentJobOrder.total_due_amount)) + " AED"
    );

    _data.push(row);
  }

  var responseModalHtml = (
    <Modal isOpen={responseModalOpen} toggle={toggleResponseModal}>
      <ModalHeader toggle={toggleResponseModal}>Response</ModalHeader>
      <ModalBody>{responseMessage}</ModalBody>
    </Modal>
  );

  function getPrintReport() {
    let convertedDate = convertDate(reportDate);

    axios(`${GENERATE_CASH_REPORT}`, {
      method: "POST",
      responseType: "blob", //Force to receive data in a Blob Format
      data: stringify({
        date: convertedDate,
        type: reportType
      })
    })
      .then(response => {
        if (response.success !== false) {
          const file = new Blob([response.data], { type: "application/pdf" });
          saveAs(
            file,
            `${reportType} Report generated on ${convertedDate}.pdf`
          );
        } else {
          showResponseModal(response.message);
        }
      })
      .catch(error => {
        showResponseModal(error);
      });
  }

  function getPrintLedgerReport() {
    let convertedDate = convertDate(reportDate);

    axios(`${GENERATE_LEDGER_REPORT}`, {
      method: "POST",
      responseType: "blob", //Force to receive data in a Blob Format
      data: stringify({
        date: convertedDate,
        type: reportType
      })
    })
      .then(response => {
        if (response.success !== false) {
          const file = new Blob([response.data], { type: "application/pdf" });
          saveAs(
            file,
            `${reportType} Report generated on ${convertedDate}.pdf`
          );
        } else {
          showResponseModal(response.message);
        }
      })
      .catch(error => {
        showResponseModal(error);
      });
  }

  return (
    <Fragment>
      {responseModalHtml}

      {user.role === "admin" ? (
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Print Reports</h4>
            <div className="row justify-content-around">
              <div className="col-md-3">
                <div
                  id="reportType"
                  className="m-1 w-100"
                  onChange={event => setReportType(event.target.value)}
                >
                  Report type:
                  <input
                    className="ml-3 m-1"
                    type="radio"
                    value="Daily"
                    name="reportType"
                    id="reportTypeDaily"
                  />{" "}
                  Daily
                  <UncontrolledTooltip
                    placement="bottom"
                    target="reportTypeDaily"
                  >
                    Daily Report
                  </UncontrolledTooltip>
                  <input
                    className="ml-3 m-1"
                    type="radio"
                    value="Monthly"
                    name="reportType"
                    id="reportTypeMonthly"
                  />{" "}
                  Monthly
                  <UncontrolledTooltip
                    placement="bottom"
                    target="reportTypeMonthly"
                  >
                    Monthly Report
                  </UncontrolledTooltip>
                  <input
                    className="ml-3 m-1"
                    type="radio"
                    value="Yearly"
                    name="reportType"
                    id="reportTypeYearly"
                  />{" "}
                  Yearly
                  <UncontrolledTooltip
                    placement="bottom"
                    target="reportTypeYearly"
                  >
                    Yearly Report
                  </UncontrolledTooltip>
                </div>
              </div>
              <div className="col-md-3">
                <DatePicker
                  className="form-control"
                  id="reportDate"
                  dateFormat="MMMM d, yyyy"
                  selected={reportDate}
                  onChange={date => {
                    setReportDate(date);
                  }}
                  todayButton="Today"
                />
                <UncontrolledTooltip placement="bottom" target="reportDate">
                  Select report date.
                </UncontrolledTooltip>
              </div>
              <div className="col-md-3">
                <Button
                  id="printLedger"
                  className="btn btn-theme btn-labeled w-100"
                  onClick={() => getPrintLedgerReport()}
                  disabled={reportType === ""}
                >
                  <FontAwesomeIcon icon={["fas", "print"]} className="mr-2" />
                  Print Ledger
                </Button>
                <UncontrolledTooltip placement="bottom" target="printLedger">
                  Print Ledger
                </UncontrolledTooltip>
              </div>
              <div className="col-md-3">
                <Button
                  id="printReportButton"
                  className="btn btn-theme btn-labeled w-100"
                  onClick={() => getPrintReport()}
                  disabled={reportType === ""}
                >
                  <FontAwesomeIcon icon={["fas", "print"]} className="mr-2" />
                  Print Cash Report
                </Button>
                <UncontrolledTooltip
                  placement="bottom"
                  target="printReportButton"
                >
                  Print selected report.
                </UncontrolledTooltip>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Employee Total</h4>
          <div className="row justify-content-around">
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
                    className="w-100"
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
                  className="w-100"
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
                  className="w-100"
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
    </Fragment>
  );
}

function mapStateToProps({ activeUser }) {
  return { activeUser };
}

export default withRouter(connect(mapStateToProps)(DashboardAdmin));

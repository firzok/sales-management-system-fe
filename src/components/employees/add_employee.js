import React, { useState, useEffect } from "react";
import Container from "../common/application_container";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  UncontrolledTooltip
} from "reactstrap";
import { ADD_NEW_EMPLOYEE } from "../../config/rest_endpoints";
import axios from "axios";
import { stringify } from "querystring";
import { byteCode } from "../../assets/js/helper";

function AddEmployee(props) {
  const [openModalFN, setOpenModalFN] = useState(false);
  const [openModalUN, setOpenModalUN] = useState(false);
  const [openModalResponse, setOpenModalResponse] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Employee");
  const [dropDownRoleOpen, setDropDownRoleOpen] = useState(false);
  const [responseText, setResponseText] = useState("");

  var modalHtmlFN = (
    <Modal isOpen={openModalFN} toggle={toggleModalFN}>
      <ModalHeader toggle={toggleModalFN}>
        Employee first name invalid
      </ModalHeader>
      <ModalBody>{"Employee first name can not be empty."} </ModalBody>
    </Modal>
  );

  var modalHtmlUN = (
    <Modal isOpen={openModalUN} toggle={toggleModalUN}>
      <ModalHeader toggle={toggleModalUN}>
        Employee user name invalid
      </ModalHeader>
      <ModalBody>{"Username must be greater than 4 characters."} </ModalBody>
    </Modal>
  );

  var modalHtmlResponse = (
    <Modal isOpen={openModalResponse} toggle={toggleModalResponse}>
      <ModalHeader toggle={toggleModalResponse}>Message</ModalHeader>
      <ModalBody>{responseText} </ModalBody>
    </Modal>
  );

  function toggleModalFN() {
    setOpenModalFN(!openModalFN);
  }

  function toggleModalUN() {
    setOpenModalUN(!openModalUN);
  }

  function toggleModalResponse() {
    setOpenModalResponse(!openModalResponse);
  }

  const toggleRoleDropDown = () => setDropDownRoleOpen(prevState => !prevState);

  useEffect(() => {
    if (confirmPassword === password && password !== "") {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }
  }, [password, confirmPassword]);

  function resetForm() {
    setUserName("");
    setFirstName("");
    setlastName("");
    setPassword("");
    setConfirmPassword("");
    setlastName("");
    setSelectedRole("Employee");
  }

  function addEmployee() {
    if (passwordValid) {
      if (firstName === "") {
        setOpenModalFN(true);
      } else if (userName === "") {
        setOpenModalUN(true);
      } else {
        const employeeData = {
          username: byteCode.encode(userName.trim()),
          password: byteCode.encode(password),
          role: selectedRole.toLowerCase() === "admin" ? "admin" : "user",
          first_name: firstName,
          last_name: lastName
        };

        axios.defaults.withCredentials = true;
        var user = JSON.parse(sessionStorage.getItem("user"));
        axios({
          method: "post",
          url: ADD_NEW_EMPLOYEE,
          data: stringify(employeeData),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
            Authorization: "Bearer " + user.jwt_token
          }
        }).then(res => {
          if (res.status === 200) {
            if (res.data.success === true) {
              resetForm();
              setOpenModalResponse(true);
              setResponseText(res.data.message);
            } else {
              setResponseText(res.data.message);
              setOpenModalResponse(true);
            }
          }
        });
      }
    }
  }

  const roleList = [
    {
      id: 1,
      name: "Employee"
    },
    {
      id: 2,
      name: "Admin"
    }
  ];

  return (
    <Container header="Add New Employee">
      {modalHtmlFN}
      {modalHtmlUN}
      {modalHtmlResponse}
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Employee Detail</h4>

          <div className="row justify-content-around">
            <div className="col-md-4">
              <div className="form-group">
                <label className="font-weight-semibold">
                  First Name{" "}
                  <span className="c-failed" title="Required">
                    *
                  </span>
                </label>
                <input
                  name="FirstName"
                  type="text"
                  className="form-control"
                  placeholder="Enter First Name"
                  value={firstName}
                  onChange={event => setFirstName(event.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="font-weight-semibold">Last Name</label>
                <input
                  name="LastName"
                  type="text"
                  className="form-control"
                  placeholder="Enter last Name"
                  value={lastName}
                  onChange={event => setlastName(event.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="row justify-content-around">
            <div className="col-md-4">
              <div className="form-group">
                <label className="font-weight-semibold">
                  User Name{" "}
                  <span className="c-failed" title="Required">
                    *
                  </span>
                </label>
                <input
                  name="UserName"
                  type="text"
                  className="form-control"
                  placeholder="Enter User Name"
                  id="username"
                  value={userName}
                  onChange={event => setUserName(event.target.value)}
                />
                <UncontrolledTooltip placement="bottom" target="username">
                  This username will be used for logging in.
                </UncontrolledTooltip>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="font-weight-semibold">
                  Role{" "}
                  <span className="c-failed" title="Required">
                    *
                  </span>
                </label>
                <Dropdown
                  isOpen={dropDownRoleOpen}
                  toggle={toggleRoleDropDown}
                  id="userType"
                >
                  <DropdownToggle
                    caret
                    className="btn btn-theme btn-labeled text-right w-100"
                  >
                    {selectedRole}
                  </DropdownToggle>
                  <DropdownMenu
                    style={{ overflow: "auto", maxHeight: "20vh" }}
                    value={selectedRole}
                    className="w-100"
                  >
                    {roleList.map(role => (
                      <DropdownItem
                        key={role.id}
                        onClick={() => setSelectedRole(role.name)}
                      >
                        {role.name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                <UncontrolledTooltip placement="top" target="userType">
                  Permissions will be based on user type.
                </UncontrolledTooltip>
              </div>
            </div>
          </div>
          <div className="row justify-content-around">
            <div className="col-md-4">
              <div className="form-group">
                <label className="font-weight-semibold">
                  Password{" "}
                  <span className="c-failed" title="Required">
                    *
                  </span>
                </label>
                <input
                  name="Password"
                  type="password"
                  id="password"
                  className={
                    passwordValid
                      ? "form-control input-password-valid"
                      : "form-control input-password-invalid"
                  }
                  placeholder="Enter Password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                />
                <UncontrolledTooltip placement="bottom" target="password">
                  Choose a password for employee.
                </UncontrolledTooltip>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="font-weight-semibold">
                  Confirm Password{" "}
                  <span className="c-failed" title="Required">
                    *
                  </span>
                </label>
                <input
                  name="ConfirmPassword"
                  type="password"
                  id="confirmPassword"
                  className={
                    passwordValid
                      ? "form-control input-password-valid"
                      : "form-control input-password-invalid"
                  }
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={event => setConfirmPassword(event.target.value)}
                />
                <UncontrolledTooltip
                  placement="bottom"
                  target="confirmPassword"
                >
                  The two passwords should match.
                </UncontrolledTooltip>
              </div>
            </div>
          </div>
          <div className="row justify-content-around">
            <div className="col-md-2">
              <Button
                title="Add Employee"
                className="btn btn-theme btn-labeled"
                size="lg"
                block
                style={{ marginTop: "50px", marginBottom: "40px" }}
                onClick={() => addEmployee()}
                disabled={!passwordValid}
              >
                Add Employee
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
export default AddEmployee;

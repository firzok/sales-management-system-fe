import React, { useState } from "react";
import Container from "../common/application_container";
import axios from "axios";
import { CHANGE_PASSWORD } from "../../config/rest_endpoints";
import { byteCode } from "../../assets/js/helper";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { stringify } from "querystring";

function ChangePassword(props) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      onUpdatePassword();
    }
  }

  function onUpdatePassword() {
    debugger;
    if (
      oldPassword.trim() === "" ||
      newPassword.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      showResponseModal("All fields are required and cannot be empty.");
    } else if (newPassword.trim() != confirmPassword.trim()) {
      showResponseModal(
        "New Password and Confirm New Password should contain same values"
      );
    } else {
      var data = {
        old_password: byteCode.encode(oldPassword.trim()),
        new_password: byteCode.encode(newPassword.trim())
      };

      axios.defaults.withCredentials = true;
      var user = JSON.parse(sessionStorage.getItem("user"));
      axios({
        method: "post",
        url: CHANGE_PASSWORD,
        data: stringify(data),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          Authorization: "Bearer " + user.jwt_token
        }
      }).then(res => {
        if (res.status === 200) {
          if (res.data.success === true) {
            resetForm();
            showResponseModal(res.data.message);
          } else {
            showResponseModal(res.data.message);
          }
        }
      });
    }
  }

  function resetForm() {
    setNewPassword("");
    setConfirmPassword("");
    setOldPassword("");
  }

  function showResponseModal(message) {
    setResponseMessage(message);
    setResponseModalOpen(true);
  }

  function toggleResponseModal() {
    setResponseModalOpen(!responseModalOpen);
  }

  var responseModalHtml = (
    <Modal isOpen={responseModalOpen} toggle={toggleResponseModal}>
      <ModalHeader toggle={toggleResponseModal}>Response</ModalHeader>
      <ModalBody>{responseMessage}</ModalBody>
    </Modal>
  );

  return (
    <Container header="Change Password">
      {responseModalHtml}

      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label className="font-weight-semibold">
                  Current Password{" "}
                  <span className="c-failed" title="Required">
                    *
                  </span>
                </label>
                <input
                  name="OldPassword"
                  type="password"
                  className="form-control"
                  placeholder="Enter Your Current Password"
                  value={oldPassword}
                  onChange={event => setOldPassword(event.target.value)}
                  onKeyPress={event => handleKeyPress(event)}
                />
              </div>
            </div>
          </div>
          <div className="list-group-item list-group-divider mb-3"></div>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label className="font-weight-semibold">
                  New Password{" "}
                  <span className="c-failed" title="Required">
                    *
                  </span>
                </label>
                <input
                  name="NewPassword"
                  type="password"
                  className="form-control"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={event => setNewPassword(event.target.value)}
                  onKeyPress={event => handleKeyPress(event)}
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <label className="font-weight-semibold">
                  Confirm New Password{" "}
                  <span className="c-failed" title="Required">
                    *
                  </span>
                </label>
                <input
                  name="ConfirmPassword"
                  type="password"
                  className="form-control"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={event => setConfirmPassword(event.target.value)}
                  onKeyPress={event => handleKeyPress(event)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-2">
          <Button
            title="Update Password"
            className="btn btn-theme btn-labeled"
            onClick={() => onUpdatePassword()}
            disabled={
              oldPassword === "" || newPassword === "" || confirmPassword === ""
            }
          >
            Update
          </Button>
        </div>
      </div>
    </Container>
  );
}
export default ChangePassword;

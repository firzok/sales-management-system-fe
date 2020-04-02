import React, { useState } from "react";
import Container from "../common/application_container";
import axios from "axios";
import { CHANGE_PASSWORD } from "../../config/rest_endpoints";
import { byteCode } from "../../assets/js/helper";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { stringify } from "querystring";

function Settings(props) {
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [tax, setTax] = useState();
  const [orderNumber, setOrderNumber] = useState();

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
    <Container header="Settings">
      {responseModalHtml}

      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Tax</h4>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label className="font-weight-semibold">
                  Tax %{" "}
                  <span className="c-failed" title="Required">
                    *
                  </span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Tax %"
                  value={tax}
                  onChange={event => setTax(event.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Starting Order Number</h4>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label className="font-weight-semibold">
                  Starting Order Number{" "}
                  <span className="c-failed" title="Required">
                    *
                  </span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Starting Order Number"
                  value={tax}
                  onChange={event => setTax(event.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
export default Settings;

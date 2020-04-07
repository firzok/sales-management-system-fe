import React, { useState, useEffect } from "react";
import Container from "../common/application_container";
import axios from "axios";
import {
  SET_VAT,
  GET_VAT,
  SET_STARTING_ORDER_NUMBER,
  GET_STARTING_ORDER_NUMBER,
} from "../../config/rest_endpoints";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { stringify } from "querystring";

function Settings(props) {
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [vat, setVAT] = useState("");
  const [startingOrderNumber, setStartingOrderNumber] = useState("");

  useEffect(() => {
    getVAT();
    getStartingOrderNumber();
  }, []);

  function getVAT() {
    var user = JSON.parse(sessionStorage.getItem("user"));

    axios({
      method: "get",
      url: GET_VAT,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Bearer ${user.jwt_token}`,
      },
      withCredentials: true,
    }).then((res) => {
      if (res.status === 200) {
        if (res.data.success === true) {
          setVAT(res.data.vat);
        } else {
          showResponseModal(res.data.message);
        }
      } else {
        console.log("Network Error");
      }
    });
  }

  function doSetVAT() {
    var user = JSON.parse(sessionStorage.getItem("user"));

    axios({
      method: "post",
      url: SET_VAT,
      data: stringify({
        vat: vat,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Bearer ${user.jwt_token}`,
      },
      withCredentials: true,
    }).then((res) => {
      if (res.status === 200) {
        if (res.data.success === true) {
          getVAT();
        }
        showResponseModal(res.data.message);
      } else {
        console.log("Network Error");
      }
    });
  }

  function getStartingOrderNumber() {
    var user = JSON.parse(sessionStorage.getItem("user"));

    axios({
      method: "get",
      url: GET_STARTING_ORDER_NUMBER,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Bearer ${user.jwt_token}`,
      },
      withCredentials: true,
    }).then((res) => {
      if (res.status === 200) {
        if (res.data.success === true) {
          setStartingOrderNumber(res.data.order_number);
        } else {
          showResponseModal(res.data.message);
        }
      } else {
        console.log("Network Error");
      }
    });
  }

  function doSetStartingOrderNumber() {
    var user = JSON.parse(sessionStorage.getItem("user"));

    axios({
      method: "post",
      url: SET_STARTING_ORDER_NUMBER,
      data: stringify({
        order_number: startingOrderNumber,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Bearer ${user.jwt_token}`,
      },
      withCredentials: true,
    }).then((res) => {
      if (res.status === 200) {
        if (res.data.success === true) {
          getStartingOrderNumber();
        }
        showResponseModal(res.data.message);
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

  function changeOrderNumber() {}

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
                  value={vat}
                  onChange={(event) => setVAT(event.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4 align-self-end">
              <div className="form-group">
                <Button
                  title="Set"
                  className="btn btn-theme btn-labeled"
                  onClick={() => doSetVAT()}
                  disabled={vat === ""}
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Starting Order Number</h4>
          <div className="row ">
            <div className="col-md-4">
              <div className="form-group">
                <label className="font-weight-semibold">
                  Starting Order Number{" "}
                  <span className="c-failed" title="Required">
                    *
                  </span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Starting Order Number"
                  value={startingOrderNumber}
                  onChange={(event) =>
                    setStartingOrderNumber(event.target.value)
                  }
                />
              </div>
            </div>
            <div className="col-md-4 align-self-end">
              <div className="form-group">
                <Button
                  title="Set"
                  className="btn btn-theme btn-labeled"
                  onClick={() => doSetStartingOrderNumber()}
                  disabled={startingOrderNumber === ""}
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
export default Settings;

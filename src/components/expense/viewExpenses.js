import React, { useState, useEffect } from "react";
import Container from "../common/application_container";
import { Card, CardBody } from "reactstrap";

function ViewExpenses(props) {
  return (
    <Card>
      <CardBody>
        <h4 className="card-title">Expenses</h4>
      </CardBody>
    </Card>
  );
}
export default ViewExpenses;

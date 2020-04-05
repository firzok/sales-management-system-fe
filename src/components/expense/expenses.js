import React, { useState, useEffect } from "react";
import Container from "../common/application_container";

import ViewExpenses from "./viewExpenses";
import AddExpenses from "./addExpenses";

function Expenses(props) {
  return (
    <Container header="Expenses">
      <AddExpenses />
      <ViewExpenses />
    </Container>
  );
}
export default Expenses;

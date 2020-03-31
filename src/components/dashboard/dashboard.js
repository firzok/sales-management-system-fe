import React, { useEffect } from "react";
import Container from "../common/application_container";
import { connect } from "react-redux";
import DashboardAdmin from "./dashboard_admin";
import DashboardEmployee from "./dashboard_employee";
import { DASHBOARD_ADMIN } from "../router/routeConstants";

function Dashboard(props) {
  let user = JSON.parse(sessionStorage.getItem("user"));
  var Dashboard = "";

  if (user.role === "admin") {
    Dashboard = <DashboardAdmin />;
  } else {
    Dashboard = <DashboardEmployee activeUser={props.activeUser.user} />;
  }

  return <Container header="Employee Total">{Dashboard}</Container>;
}

function mapStateToProps({ activeUser }) {
  return { activeUser };
}

export default connect(mapStateToProps)(Dashboard);

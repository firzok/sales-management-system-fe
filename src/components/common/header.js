import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { LOAD_LOGIN, CHANGE_PASSWORD } from "../router/routeConstants";
import { colors, company } from "../../config/static_lists";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

var $ = window.$;

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      loadingNotifications: false,
      quote: null,
    };
  }

  componentDidMount() {
    // Toggle min sidebar class
    $(".sidebar-main-toggle").on("click", function (e) {
      e.preventDefault();

      $("body").toggleClass("sidebar-xs").removeClass("sidebar-mobile-main");
    });
    $(".sidebar-mobile-main-toggle").on("click", function (e) {
      e.preventDefault();
      $("body")
        .toggleClass("sidebar-mobile-main")
        .removeClass("sidebar-mobile-secondary sidebar-mobile-right");

      if ($(".sidebar-main").hasClass("sidebar-fullscreen")) {
        $(".sidebar-main").removeClass("sidebar-fullscreen");
      }
    });
    $(".sidebar-mobile-expand").on("click", function (e) {
      e.preventDefault();
      var $sidebar = $(this).parents(".sidebar"),
        sidebarFullscreenClass = "sidebar-fullscreen";

      if (!$sidebar.hasClass(sidebarFullscreenClass)) {
        $sidebar.addClass(sidebarFullscreenClass);
      } else {
        $sidebar.removeClass(sidebarFullscreenClass);
      }
    });
  }

  getNotifications() {
    // this.setState({ loadingNotifications: true });
    // axios.get(CURRENT_ANNOUNCEMENTS).then(res => {
    //     var notifications = res.data.data;
    //     var { total } = res.data;
    //     this.setState({ notifications, total, loadingNotifications: false });
    // }).catch(error => {
    //     this.setState({ loadingNotifications: false });
    // })
  }

  makeQuoteData(data) {
    var quote = "";

    if (data !== "") {
      if ("content" in data) {
        if (data["content"]) {
          quote = {};
          quote["content"] = data["content"];
          if ("author" in data) {
            quote["author"] = data["author"] ? data["author"] : "Unknown";
          } else {
            quote["author"] = "Unknown";
          }
        }
      }
    }

    return quote;
  }

  componentWillUnmount() {
    clearInterval(this.timeout);
  }

  logout() {
    sessionStorage.removeItem("user");
    this.props.history.push(LOAD_LOGIN);
  }

  changePassword() {
    this.props.history.push(CHANGE_PASSWORD);
  }

  render() {
    var user = this.props.activeUser.user;
    var picture = "";
    var name = "...";
    if (Object.keys(user).length) {
      var profilePicture = user["profile_picture"];
      var defaultProfilePicture =
        process.env.PUBLIC_URL + "/assets/images/avatar.png";
      const initials =
        user.first_name === "" || user.first_name === null
          ? "---"
          : user.first_name.charAt(0).toLowerCase();
      const style = {
        backgroundColor: colors[initials],
      };

      picture = (
        <button className="btn rounded-round btn-icon btn-sm" style={style}>
          <span className="letter-icon text-uppercase text-white">
            {initials}
          </span>
        </button>
      );

      name = user["first_name"];
    }

    var path = process.env.PUBLIC_URL + `/assets/images/${company}/header.png`;
    var pathHeaderBackground =
      process.env.PUBLIC_URL + `/assets/images/${company}/headerbar.png`;

    var navbar_theme = {
      backgroundPosition: "left top",
      backgroundRepeatX: "repeat",
      backgroundImage: `url(${pathHeaderBackground})`,
    };

    return (
      // <!-- Main navbar -->
      <div
        className="navbar navbar-expand-md navbar-dark fixed-top bgc-theme noprint"
        style={navbar_theme}
      >
        <div className="navbar-brand wmin-200 c-nav-brand">
          <a href="/" className="d-inline-block">
            <img src={path} alt="" />
          </a>
        </div>

        <div className="d-md-none">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbar-mobile"
          >
            <i className="icon-tree5"></i>
          </button>
          <button
            className="navbar-toggler sidebar-mobile-main-toggle"
            type="button"
          >
            <i className="icon-paragraph-justify3"></i>
          </button>
        </div>

        <div
          className="collapse navbar-collapse c_navbar-collapse"
          id="navbar-mobile"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <a
                href="#"
                className="navbar-nav-link sidebar-control sidebar-main-toggle d-none d-md-block"
              >
                <i className="icon-paragraph-justify3"></i>
              </a>
            </li>
          </ul>

          <ul className="navbar-nav ml-auto">
            <li className="nav-item dropdown dropdown-user text-capitalize">
              <a
                href="#"
                className="navbar-nav-link dropdown-toggle"
                data-toggle="dropdown"
              >
                {picture}
                <span>{name}</span>
              </a>

              <div className="dropdown-menu dropdown-menu-right">
                <a
                  className="dropdown-item"
                  onClick={this.changePassword.bind(this)}
                >
                  <FontAwesomeIcon icon={["fas", "unlock"]} className="mr-2" />
                  Change Password
                </a>
                <div className="dropdown-divider"></div>
                {/* <a className="dropdown-item" onClick={this.customization.bind(this)}><i className="icon-cog"></i> Customization</a> */}
                <a className="dropdown-item" onClick={this.logout.bind(this)}>
                  <i className="icon-switch2"></i> Logout
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
      // <!-- /main navbar -->
    );
  }
}

function mapStateToProps({ activeUser }) {
  return { activeUser };
}

export default connect(mapStateToProps)(withRouter(Header));

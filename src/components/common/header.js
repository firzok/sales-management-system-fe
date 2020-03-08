import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { LOAD_LOGIN, CHANGE_PASSWORD, VIEW_PROFILE, CHANGE_PROFILE_PICTURE, VIEW_EMPLOYEE_PROFILE, CUSTOMIZATION, ANNOUNCEMENTS_URL } from '../router/routeConstants';
import { colors, company } from '../../config/static_lists';
import axios from 'axios';
import { CURRENT_ANNOUNCEMENTS, QUOTE_GENERATOR } from '../../config/rest_endpoints';

var $ = window.$;

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
            loadingNotifications: false,
            quote: null
        }
    }

    componentDidMount() {
        // Toggle min sidebar class
        $('.sidebar-main-toggle').on('click', function (e) {
            e.preventDefault();

            $('body').toggleClass('sidebar-xs').removeClass('sidebar-mobile-main');
        });
        $('.sidebar-mobile-main-toggle').on('click', function (e) {
            e.preventDefault();
            $('body').toggleClass('sidebar-mobile-main').removeClass('sidebar-mobile-secondary sidebar-mobile-right');

            if ($('.sidebar-main').hasClass('sidebar-fullscreen')) {
                $('.sidebar-main').removeClass('sidebar-fullscreen');
            }
        });
        $('.sidebar-mobile-expand').on('click', function (e) {
            e.preventDefault();
            var $sidebar = $(this).parents('.sidebar'),
                sidebarFullscreenClass = 'sidebar-fullscreen'

            if (!$sidebar.hasClass(sidebarFullscreenClass)) {
                $sidebar.addClass(sidebarFullscreenClass);
            }
            else {
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
            if ('content' in data) {
                if (data["content"]) {
                    quote = {};
                    quote["content"] = data["content"];
                    if ('author' in data) {
                        quote["author"] = data["author"] ? data["author"] : "Unknown";
                    }
                    else {
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
        sessionStorage.removeItem('user');
        this.props.history.push(LOAD_LOGIN);
    }

    customization() {
        this.props.history.push(CUSTOMIZATION);
    }

    changePassword() {
        this.props.history.push(CHANGE_PASSWORD);
    }

    changeProfilePicture() {
        this.props.history.push(CHANGE_PROFILE_PICTURE);
    }

    viewProfile() {
        this.props.history.push({
            pathname: `${VIEW_PROFILE}`,
            empID: `${this.props.activeUser.user["empID"]}`,
            self: true
        });
    }

    renderNotifications() {
        const notificationTextLimit = 30;
        var notifications = this.state.notifications;

        if (notifications && notifications.length) {
            return notifications.map((notification, idx) => {
                var name = notification.added_by_name === "" || notification.added_by_name === null ? notification.added_by : notification.added_by_name;
                var description = notification.description ? notification.description.substring(0, notificationTextLimit) : `${""}`;
                if (notification.description.length > notificationTextLimit) {
                    description = `${description}...`;
                }

                var profilePicture = notification.profile_picture;
                var defaultProfilePicture = process.env.PUBLIC_URL + "/assets/images/avatar.png";
                const initials = name.charAt(0).toLowerCase();
                const style = {
                    backgroundColor: colors[initials],
                    width: '36px',
                    height: '36px',
                    cursor: 'default'
                }

                var picture = <button className="btn rounded-round btn-icon" style={ style }>
                    <span className="letter-icon text-uppercase text-white">{ initials }</span>
                </button>;
                if (profilePicture !== null && profilePicture !== '') {
                    picture = <img src={ profilePicture } onError={ (e) => { e.target.onerror = null; e.target.src = defaultProfilePicture } } className="rounded-circle" width="36" height="36" alt="" />
                }

                return (
                    <li key={ idx } className="media cursor-pointer" onClick={ () => { this.props.history.push({ pathname: ANNOUNCEMENTS_URL }) } } >
                        <div className="mr-2">
                            { picture }
                        </div>

                        <div className="media-body br-all">
                            <strong className="text-capitalize">{ name }</strong> added announcement: "{ description }"
                            <div><i className="fas fa-bullhorn text-danger-400"></i><span className="text-muted font-size-sm ml-1">{ notification.time_ago }</span></div>
                        </div>
                    </li>
                )
            })
        }
        else {
            return (
                <li className="media cursor-pointer">
                    <span className="text-muted font-size-sm ml-1">No announcements available.</span>
                </li>
            )
        }
    }

    render() {
        var user = this.props.activeUser.user;
        var picture = '';
        var name = "...";
        if (Object.keys(user).length) {
            var profilePicture = user["profile_picture"];
            var defaultProfilePicture = process.env.PUBLIC_URL + "/assets/images/avatar.png";
            // const initials = user.firstname === "" || user.firstname === null ? "---" : user.firstname.charAt(0).toLowerCase();
            const initials = 'a'
            const style = {
                backgroundColor: colors[initials]
            }

            picture = <button className="btn rounded-round btn-icon btn-sm" style={ style }>
                <span className="letter-icon text-uppercase text-white">{ initials }</span>
            </button>;
            if (profilePicture !== null && profilePicture !== '') {
                picture = <img src={ profilePicture } onError={ (e) => { e.target.onerror = null; e.target.src = defaultProfilePicture } } className="rounded-circle" alt="" />
            }
            name = user["firstname"];
        }

        var path = process.env.PUBLIC_URL + `/assets/images/${company}/header.png`;
        var pathHeaderBackground = process.env.PUBLIC_URL + `/assets/images/${company}/headerbar.png`;

        var navbar_theme = {
            backgroundPosition: 'left top',
            backgroundRepeatX: 'repeat',
            backgroundImage: `url(${pathHeaderBackground})`
        }

        var quote = ''

        if (this.state.quote) {
            if (this.state.quote !== "") {
                quote = <div className="media">
                    <div className="media-body">
                        "{ this.state.quote.content }"
                                <div className="row mt-2">
                            <div className="col-12">
                                <div className="text-muted text-capitalize float-right">~{ this.state.quote.author }</div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            else {
                quote = <div className="media">
                    <div className="media-body">
                        "If you cannot do great things, do small things in a great way."
                                <div className="row mt-2">
                            <div className="col-12">
                                <div className="text-muted text-capitalize float-right">~Napoleon Hill</div>
                            </div>
                        </div>
                    </div>
                </div>;
            }
        }

        return (
            // <!-- Main navbar -->
            <div className="navbar navbar-expand-md navbar-dark fixed-top bgc-theme noprint" style={ navbar_theme }>
                <div className="navbar-brand wmin-200 c-nav-brand">
                    <a href="/" className="d-inline-block">
                        <img src={ path } alt="" />
                    </a>
                </div>

                <div className="d-md-none">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-mobile">
                        <i className="icon-tree5"></i>
                    </button>
                    <button className="navbar-toggler sidebar-mobile-main-toggle" type="button">
                        <i className="icon-paragraph-justify3"></i>
                    </button>
                </div>

                <div className="collapse navbar-collapse c_navbar-collapse" id="navbar-mobile">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a href="#" className="navbar-nav-link sidebar-control sidebar-main-toggle d-none d-md-block">
                                <i className="icon-paragraph-justify3"></i>
                            </a>
                        </li>
                    </ul>

                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item dropdown">
                            <a href="#" className="navbar-nav-link dropdown-toggle caret-0" data-toggle="dropdown">
                                <i className="fas fa-quote-right font-s-16"></i>
                                <span className="d-md-none ml-2">Quote</span>
                            </a>

                            <div className="dropdown-menu dropdown-menu-right dropdown-content wmin-md-350">
                                <div className="dropdown-content-header">
                                    <span className="font-weight-semibold">Quote</span>
                                </div>

                                <div className="dropdown-content-body dropdown-scrollable">
                                    { quote }
                                </div>
                            </div>
                        </li>
                        <li className="nav-item dropdown">
                            <a href="#" className="navbar-nav-link dropdown-toggle caret-0" data-toggle="dropdown">
                                <i className="icon-bell3"></i>
                                <span className="d-md-none ml-2">Announcements</span>
                                {
                                    this.state.total > 0 ? <span className="badge badge-pill bg-warning-400 ml-auto ml-md-0">{ this.state.total }</span> : ""
                                }
                            </a>

                            <div className="dropdown-menu dropdown-menu-right dropdown-content wmin-md-350">
                                <div className="dropdown-content-header">
                                    <span className="font-weight-semibold">Announcements</span>
                                    {/* <a href="#" className="text-default"><i className="icon-sync"></i></a> */ }
                                </div>

                                <div className="dropdown-content-body dropdown-scrollable">
                                    <ul className="media-list">
                                        { this.renderNotifications() }
                                    </ul>
                                </div>

                                <div className="dropdown-content-footer justify-content-center">
                                    <span onClick={ () => { this.props.history.push({ pathname: ANNOUNCEMENTS_URL }) } } className="text-grey cursor-pointer">See All</span>
                                </div>
                            </div>
                        </li>

                        <li className="nav-item dropdown dropdown-user text-capitalize">
                            <a href="#" className="navbar-nav-link dropdown-toggle" data-toggle="dropdown">
                                { picture }
                                <span>{ name }</span>
                            </a>

                            <div className="dropdown-menu dropdown-menu-right">
                                <a className="dropdown-item" onClick={ this.viewProfile.bind(this) }><i className="fas fa-user side-menu_icon"></i> View Profile</a>
                                <a className="dropdown-item" onClick={ this.changePassword.bind(this) }><i className="fas fa-user-shield side-menu_icon"></i> Change Password</a>
                                <a className="dropdown-item" onClick={ this.changeProfilePicture.bind(this) }><i className="fas fa-id-card-alt side-menu_icon"></i> Change Profile Picture</a>
                                <div className="dropdown-divider"></div>
                                {/* <a className="dropdown-item" onClick={this.customization.bind(this)}><i className="icon-cog"></i> Customization</a> */ }
                                <a className="dropdown-item" onClick={ this.logout.bind(this) }><i className="icon-switch2"></i> Logout</a>

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
    return { activeUser }
}

export default connect(mapStateToProps)(withRouter(Header));

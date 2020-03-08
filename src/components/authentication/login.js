import React, { Component } from 'react';
import { connect } from "react-redux";
import Modal from 'react-bootstrap4-modal';
import { login } from '../../actions/index';
// import { Notifications } from '../common/notification';
import axios from 'axios';
import { RESET_PASSWORD } from '../../config/rest_endpoints';
import { byteCode } from '../../assets/js/helper';
import { company } from '../../config/static_lists';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            error: "",
            startAnimationSpinner: false,
            startAnimationError: false,
            modalIsOpen: false,
            recoveryEmail: '',
            isRecoveringPassword: false,
            recoveryEmailError: false
        }
    }

    onLogin() {
        if (this.state.username.trim() !== "" && this.state.password !== "") {
            this.setState({ startAnimationSpinner: true });

            var username = byteCode.encode(this.state.username.trim());
            var password = byteCode.encode(this.state.password);

            const loginDetails = `grant_type=password&username=${username}&password=${password}`;
            this.props.login(loginDetails);
        }
        else {
            this.setState({ error: "Username & Password must be provided." });
        }

    }

    closeModal() {
        this.setState({ modalIsOpen: false, recoveryEmailError: false });
    }

    openModal() {
        this.setState({ modalIsOpen: true });
    }

    onUsernameChange(e) {
        this.setState({ username: e.target.value })
    }

    onPasswordChange(e) {
        this.setState({ password: e.target.value })
    }

    handleChange(e) {
        var recoveryEmailError = this.checkForRecoveryEmail(e.target.value);
        this.setState({ recoveryEmail: e.target.value, recoveryEmailError });
    }

    checkForRecoveryEmail(value) {
        var recoveryEmailError = false;
        if (value.trim() === "") {
            recoveryEmailError = true;
        }

        return recoveryEmailError;
    }

    checkForLoggedUser() {
        return (sessionStorage.getItem('user') !== null) ? true : false;
    }

    animationEndError() {
        this.setState({ startAnimationError: false });
    }

    UNSAFE_componentWillMount() {
        debugger
        var response = this.props.activeUser;
        if (response['message']) {
            if (response['message'] === "Network Error") {
                this.setState({ error: "Network Error!", startAnimationSpinner: false, startAnimationError: true });
            }
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        var response = newProps.activeUser;
        if (response['message']) {
            if (response['message'] === "Network Error") {
                this.setState({ error: "Network Error!", startAnimationSpinner: false, startAnimationError: true });
                const elm = this.refs.errorAnimation;
                elm.addEventListener('animationend', this.animationEndError.bind(this));
            }
            else if (response['message'] === "Something Went Wrong") {
                this.setState({ error: "Something Went Wrong!", startAnimationSpinner: false, startAnimationError: true });
                const elm = this.refs.errorAnimation;
                elm.addEventListener('animationend', this.animationEndError.bind(this));
            }
        }
        else if (!this.checkForLoggedUser()) {
            if (response['error']) {
                if ('error_description' in response) {
                    this.setState({ error: response['error_description'], startAnimationSpinner: false, startAnimationError: true });
                }
                else {
                    this.setState({ error: response['error'], startAnimationSpinner: false, startAnimationError: true });
                }
                const elm = this.refs.errorAnimation;
                elm.addEventListener('animationend', this.animationEndError.bind(this));
            }
            else {
                var user = response.user
                sessionStorage.setItem("user", JSON.stringify(user));
                this.setState({ username: '', password: '', startAnimationSpinner: false });
                this.props.history.push("/");
            }
        }
    }

    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.onLogin();
        }
    }

    onRecoverEmail() {
        var recoveryEmailError = this.checkForRecoveryEmail(this.state.recoveryEmail);
        if (recoveryEmailError) {
            this.setState({ recoveryEmailError });
        }
        // else {
        //     this.setState({ isRecoveringPassword: true, recoveryEmailError });
        //     var headers = {
        //         username: this.state.recoveryEmail
        //     }
        //     axios.post(RESET_PASSWORD, {}, { headers }).then(res => {
        //         Notifications.notify("New password sent via email.", "Success", "success");
        //         this.closeModal();
        //         this.setState({ isRecoveringPassword: false, recoveryEmail: '' });
        //     }).catch(error => {
        //         this.setState({ isRecoveringPassword: false });
        //         var message = "Something went wrong while resetting the password!";
        //         if ('response' in error) {
        //             message = error.response.data.message;
        //         }
        //         Notifications.notify(message, "Error", "error");
        //     })
        // }
    }

    render() {
        var errorAnimationClass = "";
        if (this.state.startAnimationError) {
            errorAnimationClass = "animated fadeIn";
        }

        var recoveryEmailError = '';
        if (this.state.recoveryEmailError) {
            recoveryEmailError = <div className="alert alert-danger alert-styled-left alert-arrow-left ">Enter your email to reset the password.</div>
        }

        var modal =
            <Modal visible={ this.state.modalIsOpen } onClickBackdrop={ this.closeModal.bind(this) } dialogClassName="modal-sm">
                <div className="card mb-0">
                    <div className="card-body">
                        <div className="text-center mb-3">
                            <i className="icon-spinner11 icon-2x text-warning border-warning border-3 rounded-round p-3 mb-3 mt-1"></i>
                            <h5 className="mb-0">Password recovery</h5>
                            <span className="d-block text-muted">We'll send you instructions in email</span>
                        </div>
                        { recoveryEmailError }
                        <div className="form-group form-group-feedback form-group-feedback-right">
                            <input type="email" className="form-control" placeholder="Your email" value={ this.state.recoveryEmail } onChange={ this.handleChange.bind(this) } />
                            <div className="form-control-feedback">
                                <i className="icon-mail5 text-muted"></i>
                            </div>
                        </div>

                        <button className="btn bg-blue btn-block" disabled={ this.state.isRecoveringPassword } onClick={ this.onRecoverEmail.bind(this) }><i className={ this.state.isRecoveringPassword ? "icon-spinner11 spinner mr-2" : "icon-spinner11 mr-2" }></i> { this.state.isRecoveringPassword ? "Resetting..." : "Reset password" }</button>
                    </div>
                </div>
            </Modal>

        var path = process.env.PUBLIC_URL + `/assets/images/logo.png`;
        var loginCover = {
            background: `url(/assets/images/bg-login.jpg) no-repeat`,
            backgroundSize: 'cover',
        }
        return (
            <div className="virtual-body">
                { modal }
                <div className="page-content color-login bgc-theme" style={ loginCover }>
                    <div className="content-wrapper">
                        <div className="content d-flex justify-content-center align-items-center">
                            <div className="login-form">
                                <div className="card mb-0">
                                    <div className="card-body">
                                        <div className="text-center mb-3">
                                            <a href="#">
                                                <img src={ path } className="img-fluid login-image c-width-70 mb-4" style={ { backgroundSize: 'cover' } } />
                                            </a>
                                            <h5 className="mb-0 color-login">Login to your account</h5>
                                            <span className="d-block text-muted">Your credentials</span>
                                        </div>

                                        <div ref="errorAnimation" className={ this.state.error === "" ? "alert alert-danger alert-styled-left alert-arrow-left hide-container" : `alert alert-danger alert-styled-left alert-arrow-left ${errorAnimationClass}` }>
                                            { this.state.error }
                                        </div>

                                        <div className="form-group form-group-feedback form-group-feedback-left">
                                            <input type="text" className="form-control" placeholder="Username" onKeyPress={ this._handleKeyPress.bind(this) } value={ this.state.username } onChange={ this.onUsernameChange.bind(this) } />
                                            <div className="form-control-feedback">
                                                <i className="icon-user text-muted"></i>
                                            </div>
                                        </div>

                                        <div className="form-group form-group-feedback form-group-feedback-left">
                                            <input type="password" className="form-control" placeholder="Password" onKeyPress={ this._handleKeyPress.bind(this) } value={ this.state.password } onChange={ this.onPasswordChange.bind(this) } />
                                            <div className="form-control-feedback">
                                                <i className="icon-lock2 text-muted"></i>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <button onClick={ this.onLogin.bind(this) } disabled={ this.state.startAnimationSpinner ? true : false } className="btn btn-login btn-block">{ this.state.startAnimationSpinner ? "Authenticating" : "Login" } <i className={ this.state.startAnimationSpinner ? "fas fa-spinner fa-spin ml-2" : "icon-circle-right2 ml-2" }></i></button>
                                        </div>

                                        <div className="d-flex align-items-center mb-1">
                                            <span className="form-text text-center text-muted">SMS by <a href="#" target="_blank">Atoms</a></span>
                                            <span className="ml-auto custom-link cursor-pointer" onClick={ this.openModal.bind(this) }>Forgot password?</span>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <span className="form-text text-center text-muted">Last Updated: 6th Nov, 2019 (V-3.2.0)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

function mapStateToProps({ activeUser }) {
    return { activeUser }
}

export default connect(mapStateToProps, { login })(Login);
import React, { Component } from 'react';
import Container from '../common/application_container';
import axios from 'axios';
import Button from 'react-bootstrap-button-loader';
import { UPDATE_PASSWORD } from '../../config/rest_endpoints';
// import { Notifications } from '../common/notification';
import { byteCode } from '../../assets/js/helper';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            OldPassword: "",
            NewPassword: "",
            ConfirmPassword: "",
            isPasswordChanging: false
        };
    }

    handleChange(e) {
        var { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.onUpdatePassword();
        }
    }

    onUpdatePassword() {
        if (this.state.OldPassword.trim() === "" || this.state.NewPassword.trim() === "" || this.state.ConfirmPassword.trim() === "") {
            alert("All fields are required and cannot be empty");
        }
        else if (this.state.NewPassword.trim() != this.state.ConfirmPassword.trim()) {
            alert("New Password and Confirm New Password should contain same values");
        }
        else {
            this.setState({ isPasswordChanging: true });
            var data = {
                "OldPassword": byteCode.encode(this.state.OldPassword.trim()),
                "NewPassword": byteCode.encode(this.state.NewPassword.trim()),
                "ConfirmPassword": byteCode.encode(this.state.ConfirmPassword.trim())
            }
            axios.post(UPDATE_PASSWORD, data).then(res => {
                this.setState({ isPasswordChanging: false });
                // Notifications.notify("Password changed successfully", "Success");
            }).catch(error => {
                this.setState({ isPasswordChanging: false });
                var message = "Error occurred while changing password!";
                if ('response' in error) {
                    message = error.response.data['message'];
                    if (message.toLowerCase() === "incorrect password.") {
                        message = "Incorrect Current Password."
                    }
                    else if (message.toLowerCase() === "passwords must be at least 3 characters.") {
                        message = "New Password must be at least 3 characters long."
                    }
                }
                // Notifications.notify(message, "Error", "error");
            })
        }
    }

    render() {
        return (
            <Container header="Change Password">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label className="font-weight-semibold">Current Password <span className="c-failed" title="Required">*</span></label>
                                    <input
                                        name="OldPassword"
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter Your Current Password"
                                        value={ this.state.OldPassword }
                                        onChange={ this.handleChange.bind(this) }
                                        onKeyPress={ this.handleKeyPress.bind(this) }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="list-group-item list-group-divider mb-3"></div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label className="font-weight-semibold">New Password <span className="c-failed" title="Required">*</span></label>
                                    <input
                                        name="NewPassword"
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter New Password"
                                        value={ this.state.NewPassword }
                                        onChange={ this.handleChange.bind(this) }
                                        onKeyPress={ this.handleKeyPress.bind(this) }
                                    />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label className="font-weight-semibold">Confirm New Password <span className="c-failed" title="Required">*</span></label>
                                    <input
                                        name="ConfirmPassword"
                                        type="password"
                                        className="form-control"
                                        placeholder="Confirm New Password"
                                        value={ this.state.ConfirmPassword }
                                        onChange={ this.handleChange.bind(this) }
                                        onKeyPress={ this.handleKeyPress.bind(this) }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2">
                        <Button title="Update Password"
                            className="btn btn-theme btn-labeled"
                            onClick={ this.onUpdatePassword.bind(this) }
                            loading={ this.state.isPasswordChanging }
                        >
                            Update
                        </Button>
                    </div>
                </div>
            </Container>
        );
    }
}
export default ChangePassword;
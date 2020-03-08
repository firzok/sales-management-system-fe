import React, { Component } from 'react';
import Container from '../common/application_container';
import { connect } from "react-redux";
import DashboardAdmin from './dashboard_admin';
import DashboardEmployee from './dashboard_employee';
import { DASHBOARD_ADMIN } from '../router/routeConstants';
import Modal from 'react-bootstrap4-modal';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            modalBody: [
                'Kindly note that you are accessing the Beta deployment Version of I-LMS. The principle reason for this variant is to get familiar with the software and get feedback',
                'I-LMS will not be liable for any kind of loss, whether such loss is direct, indirect, special or consequential, suffered by any party as a result of their use of the I-LMS, its software or content.',
                'Should you encounter any bugs, glitches or any other issues in the system; please report to: <a>waqar.khan@automotive-ai.com</a>',
                'Your feedback in this regard will be highly appreciated.'
            ]
        }

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    UNSAFE_componentWillMount() {
        var __user = JSON.parse(sessionStorage.getItem('user'));
        if (__user) {
            this.setState({ modalIsOpen: __user['Disclaimer'] })
        }
    }

    openModal() {
        this.setState({ modalIsOpen: true })
    }

    afterOpenModal() {
        this.subtitle.style.color = '#f00';
    }

    closeModal() {
        var __user = JSON.parse(sessionStorage.getItem('user'));
        if (__user) {
            __user['Disclaimer'] = false
        }

        sessionStorage.setItem("user", JSON.stringify(__user));

        this.setState({ selectedEmployee: null, modalIsOpen: false });
    }


    render() {
        var Dashboard = "";
        // var permissions = this.props.activeUser["permissions"].split(",");
        var permissions = [DASHBOARD_ADMIN]

        if (permissions.includes(DASHBOARD_ADMIN)) {
            Dashboard = <DashboardAdmin />;
        }
        else {
            Dashboard = <DashboardEmployee activeUser={ this.props.activeUser.user } />;
        }

        var Disclaimer = <Modal
            visible={ this.state.modalIsOpen }>
            <div className="modal-header c-modal-header bg-theme c-color_white">
                <h5 className="modal-title"> Disclaimer </h5>
            </div>
            <div className="modal-body text-justify">
                <p>Kindly note that you are accessing the Beta Version of I-LMS. The principle reason for this variant is to lead testing and get feedback.</p>
                <p>I-LMS will not be liable for any kind of loss, whether such loss is direct, indirect, special or consequential, suffered by any party as a result of their use of the I-LMS, its software or content.</p>
                <p>Should you encounter any bugs, glitches or any other issues in the system; please report to:
                                    <span className="ml-2">
                        <a href="mailto:waqar.khan@automotive-ai.com" target="_top" className="text-theme c-hand">waqar.khan@automotive-ai.com</a>
                    </span>
                </p>
                <p> Your feedback in this regard will be highly appreciated.</p>
            </div>
            <div className="modal-footer">
                <button onClick={ this.closeModal.bind(this) } className="btn bg-theme">Accept</button>
            </div>
        </Modal>

        return (
            <Container header="Dashboard">
                { Disclaimer }
                { Dashboard }
            </Container>
        );
    }

}

function mapStateToProps({ activeUser }) {
    return { activeUser }
}

export default connect(mapStateToProps)(Dashboard);
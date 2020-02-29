import React from 'react';
import { HELP } from '../router/routeConstants';

const Footer = (props) => {
    return (
        // <!-- Footer -->
        <div className="navbar navbar-expand-lg navbar-light">
            <div className="text-center d-lg-none w-100">
                <button type="button" className="navbar-toggler dropdown-toggle" data-toggle="collapse" data-target="#navbar-footer">
                    <i className="icon-unfold mr-2"></i>
                    LMS
                    </button>
            </div>

            <div className="navbar-collapse collapse" id="navbar-footer">
                <span className="navbar-text">
                    <a href="/">Sales Management System</a>
                </span>
                <ul className="navbar-nav ml-lg-auto">
                    <li className="nav-item" title="Software Help"><a href={ HELP } target="_blank" className="navbar-nav-link font-weight-semibold"><span className="text-pink-400"><i className="icon-question7 font-16"></i> Help</span></a></li>
                </ul>
            </div>
        </div>
        // <!-- /footer -->
    );
};

export default Footer;
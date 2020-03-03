import React, { Component } from 'react';
import Header from './header';
import PageHeader from './page_header';
import SideMenu from './side_menu';
import Footer from './footer';

class Container extends Component {
    render() {
        var loader = "";
        if (this.props.showLoader) {
            loader = <div className="loading-container-app">
                <span className="badge bg-warning-400 loading-content-app py-2 px-2 font-s-12">Loading...</span>
            </div>;
        }
        return (
            <div className="virtual-body navbar-top-custom">
                {loader}
                <Header />
                <div className="page-content">
                    <SideMenu />
                    {/* <!-- Main content --> */}
                    <div className="content-wrapper m-top-3">
                        <PageHeader
                            header={this.props.header}
                            faIcon={this.props.faIcon}
                        />
                        {/* <!-- Content area --> */}
                        <div className="content">
                            {this.props.children}
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        );
    }
};

export default Container;

Container.defaultProps = {
    showLoader: false
}
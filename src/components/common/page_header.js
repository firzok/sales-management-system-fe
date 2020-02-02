import React, {Component} from 'react';

class PageHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            //<!-- Page header -->
            <div className="page-header page-header-light noprint">
                <div className="page-header-content header-elements-md-inline">
                    <div className="page-title">
                        <h4>
                            {/* <i className={this.props.faIcon} style={{"paddingRight":"10px"}}></i> */}
                            <span className="font-weight-semibold">{this.props.header}</span>
                        </h4>
                        {/* <a href="#" className="header-elements-toggle text-default d-md-none"><i className="icon-more"></i></a> */}
                    </div>
                </div>
            </div>
            //<!-- /page header -->
        );
    }
}

export default PageHeader;
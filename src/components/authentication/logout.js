import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { LOAD_LOGIN } from '../router/routeConstants';

class Logout extends Component {
    UNSAFE_componentWillMount() {
        localStorage.removeItem('user');
        this.props.history.push(LOAD_LOGIN);
    }

    render() {

        var return_div = (
            <div className="container-fluid" style={ { "marginTop": "20%" } }>
                <div className="row btn-col">
                    <div className="col-5">
                    </div>
                    <div className="col">
                        <div className='w-25 ma2 h4 items-center justify-center flex flex-column flex-wrap'>
                            Loading...
                        </div>
                    </div>
                    <div className="col-5">
                    </div>
                </div>
            </div>
        );

        return (
            <div>
                { return_div }
            </div>
        )
    }


};

export default withRouter(Logout);
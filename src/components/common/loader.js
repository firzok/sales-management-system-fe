import React, {Component} from 'react';
import Loader from 'react-loader-spinner'

class CustomLoader extends Component {
    render() {
        return(
            <div className="row" style={this.props.customstyles} >
                <Loader 
                    type={this.props.type}
                    color={this.props.color}
                    height={this.props.width}	
                    width={this.props.height}
                />   
            </div>

        );
    }
}

export default CustomLoader;


CustomLoader.defaultProps = {
    customstyles : {"marginLeft": "40%"},
    width: 100,
    height: 100,
    color : "#1e8d9a",
    type : "Triangle"
}
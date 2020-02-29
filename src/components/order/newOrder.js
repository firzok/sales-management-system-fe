import Container from '../common/application_container';
import React, { useState } from 'react';
import { connect } from "react-redux";
import axios from 'axios';
import Button from 'react-bootstrap-button-loader';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, NumericInput } from 'reactstrap';
import CurrencyInput from 'react-currency-input';


function NewOrder(props) {
    const [dropdownProductTypeOpen, setDropdownProductTypeOpen] = useState(false);
    const [dropdownProductOpen, setDropdownProductOpen] = useState(false);
    const [productDisabled, setProductDisabled] = useState(true);

    const [quantity, setQuantity] = useState(1);




    const toggleProductType = () => setDropdownProductTypeOpen(prevState => !prevState);
    const toggleProduct = () => setDropdownProductOpen(prevState => !prevState);

    return (
        <Container header="New Order">
            <div className="card">
                <div className="card-body">
                    <h5 class="card-title">Customer</h5>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label className="font-weight-semibold">Phone Number <span className="c-failed" title="Required">*</span></label>
                                <input
                                    name="CustomerPhoneNumber"
                                    type="tel"
                                    className="form-control"
                                    placeholder="Enter Customer Phone Number"
                                // value={ this.state.OldPassword }
                                // onChange={ this.handleChange.bind(this) }
                                // onKeyPress={ this.handleKeyPress.bind(this) }
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label className="font-weight-semibold">Name <span className="c-failed" title="Required">*</span></label>
                                <input
                                    name="CustomerName"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Customer Name"
                                // value={ this.state.OldPassword }
                                // onChange={ this.handleChange.bind(this) }
                                // onKeyPress={ this.handleKeyPress.bind(this) }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <Button title="Add New Customer"
                                className="btn btn-theme btn-labeled"
                            // onClick={ this.onUpdatePassword.bind(this) }
                            // loading={ this.state.isPasswordChanging }
                            >
                                Load Existing
                                </Button>
                        </div>
                        <div className="col-md-4">
                            <Button title="Add New Customer"
                                className="btn btn-theme btn-labeled"
                            // onClick={ this.onUpdatePassword.bind(this) }
                            // loading={ this.state.isPasswordChanging }
                            >
                                Add New
                                </Button>
                        </div>

                    </div>
                </div>

                <div className="card-body">
                    <h5 class="card-title">Order Details</h5>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label className="font-weight-semibold">Product Type <span className="c-failed" title="Required">*</span></label>

                                <Dropdown isOpen={ dropdownProductTypeOpen } toggle={ toggleProductType }>
                                    <DropdownToggle caret className="btn btn-theme btn-labeled">
                                        Select Product Type
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>Type 1</DropdownItem>
                                        <DropdownItem>type 2</DropdownItem>
                                        <DropdownItem>Type 3</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="form-group">
                                <label className="font-weight-semibold">Product <span className="c-failed" title="Required">*</span></label>

                                <Dropdown isOpen={ dropdownProductOpen } toggle={ toggleProduct }>
                                    <DropdownToggle caret className="btn-theme btn-labeled" disabled={ true }>
                                        Select Product
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>Product 1</DropdownItem>
                                        <DropdownItem>Product 2</DropdownItem>
                                        <DropdownItem>Product 3</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label className="font-weight-semibold">Quantity <span className="c-failed" title="Required">*</span></label>

                                <input type="Number" className="form-control" min={ 1 } value={ quantity } />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label className="font-weight-semibold">Price <span className="c-failed" title="Required">*</span></label>

                                <CurrencyInput className="form-control" suffix=" AED" precision="0" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-2">
                    <Button title="Update Password"
                        className="btn btn-theme btn-labeled"
                    // onClick={ this.onUpdatePassword.bind(this) }
                    // loading={ this.state.isPasswordChanging }
                    >
                        Add Order
                        </Button>
                </div>
            </div>
        </Container>
    )

}

function mapStateToProps({ activeUser }) {
    return { activeUser }
}
export default connect(mapStateToProps)(NewOrder);
import Container from '../common/application_container';
import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import axios from 'axios';
import Button from 'react-bootstrap-button-loader';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import CurrencyInput from 'react-currency-input';
import { PRODUCT_TYPES, PRODUCTS } from '../../config/rest_endpoints';
import { stringify } from 'querystring';
import DatePicker from "react-datepicker";
import { addDays } from 'date-fns';


function NewOrder(props) {

    var formatter = new Intl.NumberFormat('en-US');

    const defaultProduct = {
        name: "Select Product"
    }

    const defaultProductType = {
        name: "Select Product Type"
    }

    const [dropdownProductTypeOpen, setDropdownProductTypeOpen] = useState(false);
    const [dropdownProductOpen, setDropdownProductOpen] = useState(false);
    const [productDisabled, setProductDisabled] = useState(true);
    const [productTypeList, setProductTypeList] = useState([]);
    const [productList, setProductList] = useState([]);
    const [selectedProductType, setSelectedProductType] = useState(defaultProductType);
    const [selectedProduct, setSelectedProduct] = useState(defaultProduct);
    const [unitPrice, setUnitPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const [orderDate, setOrderDate] = useState(new Date());
    const [deliveryDate, setDeliveryDate] = useState(addDays(new Date(), 5));

    const [orderProducts, setOrderProducts] = useState([]);


    useEffect(() => {
        getProductTypes();
    }, []);

    var orderProductsHTML = "";
    useEffect(() => {
        debugger;
        orderProductsHTML = < div className="card">
            <div className="card-body">

                <div className="row">
                    <div className="col-md-2">
                        <label className="font-weight-semibold">Type</label>
                    </div>
                    <div className="col-md-2">
                        <label className="font-weight-semibold">Name</label>
                    </div>
                    <div className="col-md-2">
                        <label className="font-weight-semibold">Quantity</label>
                    </div>
                    <div className="col-md-2">
                        <label className="font-weight-semibold">Unit Price</label>
                    </div>
                    <div className="col-md-2">
                        <label className="font-weight-semibold">Sub Total</label>
                    </div>
                </div>

                <div>
                    { orderProducts.map((product) =>

                        <div key={ product.product_name_id } className="row">
                            <div className="col-md-2">
                                <label className="font-weight-semibold">{ product.product_type_name }</label>
                            </div>
                            <div className="col-md-2">
                                <label className="font-weight-semibold">{ product.product_name }</label>
                            </div>
                            <div className="col-md-2">
                                <label className="font-weight-semibold">{ product.quantity }</label>
                            </div>
                            <div className="col-md-2">
                                <label className="font-weight-semibold">{ formatter.format(product.unit_price) } AED</label>
                            </div>
                            <div className="col-md-2">
                                <label className="font-weight-semibold">{ formatter.format(product.quantity * product.unit_price) } AED</label>
                            </div>
                        </div>

                    ) }
                </div>
            </div>
        </div>
    }, [orderProducts])


    function getProductTypes() {
        if (productTypeList.length == 0) {
            axios.get(PRODUCT_TYPES)
                .then(
                    res => {
                        setProductTypeList(res.data);
                    });
        }

    }

    function getProducts(type) {
        setProductDisabled(true);
        axios({
            method: 'post',
            url: PRODUCTS,
            data: stringify({ id: type.id }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        })
            .then(
                res => {
                    setProductList(res.data);
                    setProductDisabled(false);
                });

    }

    function selectProductType(selectedProductType) {
        setSelectedProductType(selectedProductType);
        getProducts(selectedProductType);
        setSelectedProduct(defaultProduct)

    }

    function addProduct() {

        if (selectedProductType.name != defaultProductType.name && selectedProduct.name != defaultProduct.name) {

            var newProduct = {
                // product_type_id: selectedProductType.id,
                product_type_name: selectedProductType.name,
                product_name_id: selectedProduct.id,
                product_name: selectedProduct.name,
                quantity: parseInt(quantity),
                unit_price: unitPrice
            }
            debugger
            var products = orderProducts;
            if (products.length > 0) {
                products.unshift(newProduct)
            } else {
                products = [newProduct]
            }
            setOrderProducts(products);

            setSelectedProduct(defaultProduct);
            setSelectedProductType(defaultProductType);
            setQuantity(1);
            setUnitPrice(0);

        }

    }

    const toggleProductType = () => setDropdownProductTypeOpen(prevState => !prevState);
    const toggleProduct = () => setDropdownProductOpen(prevState => !prevState);

    return (
        <Container header="New Order Form">

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
                            <label className="font-weight-semibold">Order Date <span className="c-failed" title="Required">*</span></label>
                            <DatePicker
                                className="form-control"
                                dateFormat="yyyy-MM-dd"
                                selected={ orderDate }
                                onChange={ date => setOrderDate(date) }
                                todayButton="Today"
                            />
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label className="font-weight-semibold">Delivery Date <span className="c-failed" title="Required">*</span></label>
                                <DatePicker
                                    className="form-control"
                                    dateFormat="yyyy-MM-dd"
                                    selected={ deliveryDate }
                                    onChange={ date => setDeliveryDate(date) }
                                    todayButton="Today"
                                    minDate={ orderDate }
                                />
                            </div>
                        </div>
                    </div>

                    <h5 class="card-title">Order Details</h5>

                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label className="font-weight-semibold">Product Type <span className="c-failed" title="Required">*</span></label>

                                <Dropdown isOpen={ dropdownProductTypeOpen } toggle={ toggleProductType } >
                                    <DropdownToggle caret className="btn btn-theme btn-labeled">
                                        { selectedProductType.name }
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        { productTypeList.map((type) =>
                                            <DropdownItem key={ type.id }
                                                onClick={ () => selectProductType(type) }
                                            >
                                                { type.name }
                                            </DropdownItem>
                                        ) }
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="form-group">
                                <label className="font-weight-semibold">Product <span className="c-failed" title="Required">*</span></label>

                                <Dropdown isOpen={ dropdownProductOpen } toggle={ toggleProduct }>
                                    <DropdownToggle caret className="btn-theme btn-labeled" disabled={ productDisabled }>
                                        { selectedProduct.name }
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        { productList.map((product) =>
                                            <DropdownItem key={ product.id }
                                                onClick={ () => setSelectedProduct(product) }
                                            >
                                                { product.name }
                                            </DropdownItem>
                                        ) }
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label className="font-weight-semibold">Quantity <span className="c-failed" title="Required">*</span></label>

                                <input type="Number" className="form-control" min={ 1 } value={ quantity } onChange={ event => setQuantity(event.target.value) } />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label className="font-weight-semibold">Price <span className="c-failed" title="Required">*</span></label>

                                <CurrencyInput className="form-control" suffix=" AED" precision="0" value={ unitPrice } onChangeEvent={ (event, value, maskedValue) => setUnitPrice(maskedValue) } />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-2">
                            <Button title="Update Password"
                                className="btn btn-theme btn-labeled"
                                onClick={ () => addProduct() }
                                disabled={
                                    selectedProductType.name == defaultProductType.name || selectedProduct.name == defaultProduct.name
                                }
                            >
                                Add Product
                        </Button>
                        </div>
                    </div>
                </div>
            </div>

            { orderProducts.length > 0 ?
                orderProductsHTML :
                ""
            }




        </Container >
    )

}

function mapStateToProps({ activeUser }) {
    return { activeUser }
}
export default connect(mapStateToProps)(NewOrder);
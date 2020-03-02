import Container from '../common/application_container';
import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import axios from 'axios';
import Button from 'react-bootstrap-button-loader';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, CardSubtitle, CardTitle, CardBody, Card } from 'reactstrap';
import CurrencyInput from 'react-currency-input';
import { PRODUCT_TYPES, PRODUCTS } from '../../config/rest_endpoints';
import { stringify } from 'querystring';
import DatePicker from "react-datepicker";
import { addDays } from 'date-fns';
import { OrderProductHeader, OrderProduct } from './orderProduct'

function NewOrder(props) {

    var formatter = new Intl.NumberFormat('en-US');

    const defaultProduct = {
        name: "Select Product"
    }

    const defaultProductType = {
        name: "Select Product Type"
    }

    const [advancePayment, setAdvancePayment] = useState(0);
    const [deliveryDate, setDeliveryDate] = useState(addDays(new Date(), 5));
    const [dropdownProductOpen, setDropdownProductOpen] = useState(false);
    const [dropdownProductTypeOpen, setDropdownProductTypeOpen] = useState(false);
    const [orderDate, setOrderDate] = useState(new Date());
    const [orderProducts, setOrderProducts] = useState([]);
    const [productDisabled, setProductDisabled] = useState(true);
    const [productList, setProductList] = useState([]);
    const [productTypeList, setProductTypeList] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(defaultProduct);
    const [selectedProductType, setSelectedProductType] = useState(defaultProductType);
    const [unitPrice, setUnitPrice] = useState(0);

    useEffect(() => {
        getProductTypes();
    }, []);

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

            setOrderProducts([])

            var newProduct = {
                // product_type_id: selectedProductType.id,
                product_type_name: selectedProductType.name,
                product_name_id: selectedProduct.id,
                product_name: selectedProduct.name,
                quantity: parseInt(quantity),
                unit_price: unitPrice
            }
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

    var orderProductsHTML =
        < div className="card">
            <div className="card-body">

                <OrderProductHeader headers={["Type", "Name", "Quantity", "Unit Price", "Sub Total"]} />

                <OrderProduct orderProducts={orderProducts} />
            </div>
        </div>



    const costReducer = (accumulator, currentValue) => accumulator + (currentValue.quantity * currentValue.unit_price);
    if (orderProducts.length > 0) {
        var total = orderProducts.reduce(costReducer, 0);
    }

    return (


        <Container header="New Order Form">

            <div className="row">
                <div className="col-md-8">
                    <div className="card">

                        <div className="card-body">

                            <h4 class="card-title">Customer</h4>

                            <div className="row">
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
                            </div>

                            <div className="row">
                                <div className="col-md-4">
                                    <label className="font-weight-semibold">Order Date <span className="c-failed" title="Required">*</span></label>
                                    <DatePicker
                                        className="form-control"
                                        dateFormat="yyyy-MM-dd"
                                        selected={orderDate}
                                        onChange={date => setOrderDate(date)}
                                        todayButton="Today"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="font-weight-semibold">Delivery Date <span className="c-failed" title="Required">*</span></label>
                                        <DatePicker
                                            className="form-control"
                                            dateFormat="yyyy-MM-dd"
                                            selected={deliveryDate}
                                            onChange={date => setDeliveryDate(date)}
                                            todayButton="Today"
                                            minDate={orderDate}
                                        />
                                    </div>
                                </div>
                            </div>

                            <h4 class="card-title">Order Details</h4>

                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="font-weight-semibold">Product Type <span className="c-failed" title="Required">*</span></label>

                                        <Dropdown isOpen={dropdownProductTypeOpen} toggle={toggleProductType} >
                                            <DropdownToggle caret className="btn btn-theme btn-labeled">
                                                {selectedProductType.name}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                {productTypeList.map((type) =>
                                                    <DropdownItem key={type.id}
                                                        onClick={() => selectProductType(type)}
                                                    >
                                                        {type.name}
                                                    </DropdownItem>
                                                )}
                                            </DropdownMenu>
                                        </Dropdown>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="font-weight-semibold">Product <span className="c-failed" title="Required">*</span></label>

                                        <Dropdown isOpen={dropdownProductOpen} toggle={toggleProduct}>
                                            <DropdownToggle caret className="btn-theme btn-labeled" disabled={productDisabled}>
                                                {selectedProduct.name}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                {productList.map((product) =>
                                                    <DropdownItem key={product.id}
                                                        onClick={() => setSelectedProduct(product)}
                                                    >
                                                        {product.name}
                                                    </DropdownItem>
                                                )}
                                            </DropdownMenu>
                                        </Dropdown>
                                    </div>
                                </div>

                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="font-weight-semibold">Quantity <span className="c-failed" title="Required">*</span></label>

                                        <input type="Number" className="form-control" min={1} value={quantity} onChange={event => setQuantity(event.target.value)} />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="font-weight-semibold">Price <span className="c-failed" title="Required">*</span></label>

                                        <CurrencyInput className="form-control" suffix=" AED" precision="0" value={unitPrice} onChangeEvent={(event, value, maskedValue) => setUnitPrice(maskedValue)} />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-2">
                                    <Button title="Add Product"
                                        className="btn btn-theme btn-labeled"
                                        onClick={() => addProduct()}
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

                    {orderProducts.length > 0 ?
                        orderProductsHTML :
                        ""
                    }
                </div>

                <div className="col-md-4">

                    <Card>

                        <div className="card-body order-total-padding">

                            <h4 className="card-title"
                                style={{ marginBottom: "40px" }}
                            >Order Summary</h4>

                            <div className="row justify-content-between align-items-center" style={{ marginBottom: "30px" }}>
                                <div className="col-md-4">
                                    <label className="font-weight-semibold">Advance Payment: </label>
                                </div>
                                <div className="col-md-4 text-right">
                                    <CurrencyInput className="form-control" suffix=" AED" precision="0" value={advancePayment} onChangeEvent={(event, value, maskedValue) => setAdvancePayment(maskedValue)} />

                                </div>
                            </div>

                            <div className="row justify-content-between" style={{ marginBottom: "10px" }}>
                                <div className="col-md-4">
                                    <label className="font-weight-semibold">Amount before Tax: </label>
                                </div>
                                <div className="col-md-4 text-right">
                                    <label className="font-weight-semibold">500 AED</label>
                                </div>
                            </div>

                            <div className="row justify-content-between" style={{ marginBottom: "10px" }}>
                                <div className="col-md-4">
                                    <label className="font-weight-semibold">Amount after Tax: </label>
                                </div>
                                <div className="col-md-4 text-right">
                                    <label className="font-weight-semibold">500 AED</label>
                                </div>
                            </div>

                            <hr style={{ marginTop: "45px", marginBottom: "45px", marginLeft: "10px", marginRight: "10px" }} />

                            <div className="row justify-content-between">
                                <div className="col-md-4">
                                    <label className="font-weight-black font-s-18">Total Balance: </label>
                                </div>
                                <div className="col-md-4 text-right">
                                    <label className="font-weight-black font-s-18">{formatter.format(5000)} AED</label>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12">

                                    <Button title="Confirm Order"
                                        className="btn btn-theme btn-labeled"
                                        size="lg"
                                        block
                                        style={{ marginTop: "50px", marginBottom: "40px" }}
                                    // onClick={() => addProduct()}
                                    // disabled={
                                    //     selectedProductType.name == defaultProductType.name || selectedProduct.name == defaultProduct.name
                                    // }
                                    >
                                        Confirm Order
                                    </Button>
                                </div>

                            </div>

                        </div>

                    </Card>


                </div>

            </div>

        </Container >
    )

}

export default NewOrder;
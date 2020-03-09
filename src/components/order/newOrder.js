import Container from '../common/application_container';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap-button-loader';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Card } from 'reactstrap';
import CurrencyInput from 'react-currency-input';
import { PRODUCT_TYPES, PRODUCTS_WITH_TYPE_ID, NEW_ORDER } from '../../config/rest_endpoints';
import { stringify } from 'querystring';
import DatePicker from "react-datepicker";
import { addDays } from 'date-fns';
import { OrderProductHeader, OrderProduct } from './orderProduct'
import PhoneInput from 'react-phone-input-2'
import { convertDate } from '../helper'

function NewOrder(props) {

    var formatter = new Intl.NumberFormat('en-US');

    const defaultProduct = {
        name: "Select Product"
    }

    const defaultProductType = {
        name: "Select Product Type"
    }

    const [advancePayment, setAdvancePayment] = useState(0);
    const [customerName, setCustomerName] = useState("");
    const [customerNumber, setCustomerNumber] = useState("");
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function getProductTypes() {
        if (productTypeList.length === 0) {
            var user = JSON.parse(sessionStorage.getItem('user'));
            axios.defaults.withCredentials = true;
            var yourConfig = {
                headers: {
                    Authorization: "Bearer " + user.jwt_token
                }
            }

            axios.get(PRODUCT_TYPES, yourConfig)
                .then(
                    res => {
                        setProductTypeList(res.data);
                    });
        }

    }

    function getProducts(type) {
        setProductDisabled(true);
        var user = JSON.parse(sessionStorage.getItem('user'));
        axios({
            method: 'post',
            url: PRODUCTS_WITH_TYPE_ID,
            data: stringify({ id: type.id }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                Authorization: `Bearer ${user.jwt_token}`
            },
            withCredentials: true
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

        if (selectedProductType.name !== defaultProductType.name && selectedProduct.name !== defaultProduct.name) {

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

                <OrderProductHeader headers={ ["Type", "Name", "Quantity", "Unit Price", "Sub Total"] } />

                <OrderProduct orderProducts={ orderProducts } />
            </div>
        </div>


    var balanceAmount = 0;
    const costReducer = (accumulator, currentValue) => accumulator + (currentValue.quantity * currentValue.unit_price);
    if (orderProducts.length > 0) {
        balanceAmount = orderProducts.reduce(costReducer, 0);
    }

    var tax = ((7 * balanceAmount) / 100);

    function onAdvancePaymentChange(event, value, maskedValue) {
        if (maskedValue > (tax + balanceAmount)) {
            setAdvancePayment((tax + balanceAmount))

        }
        else {
            setAdvancePayment(maskedValue);
        }

    }

    function placeOrder() {


        if (customerName !== "" && customerNumber !== "" && orderProducts.length !== 0) {

            console.log(customerName)
            console.log(customerNumber)
            console.log(orderDate)
            console.log(deliveryDate)
            console.log(orderProducts)
            console.log(advancePayment)


            var newOrderData = {
                customer_phone_number: customerNumber,
                customer_name: customerName,
                placement_date: convertDate(orderDate),
                delivery_date: convertDate(deliveryDate),
                advance_payment: advancePayment,
                products: JSON.stringify(orderProducts)
            }
            axios({
                method: 'post',
                url: NEW_ORDER,
                data: stringify(newOrderData),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            })
                .then(
                    res => {
                        debugger;
                    });



        }
    }

    return (


        <Container header="New Order Form">
            <div className="row">
                <div className="col-md-8">
                    <div className="card">

                        <div className="card-body">

                            <h4 className="card-title">Customer</h4>

                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="font-weight-semibold">Name <span className="c-failed" title="Required">*</span></label>
                                        <input
                                            name="CustomerName"
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Customer Name"
                                            value={ customerName }
                                            onChange={ (event) => setCustomerName(event.target.value) }
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="font-weight-semibold">Phone Number <span className="c-failed" title="Required">*</span></label>
                                        <PhoneInput className="form-control" name="CustomerPhoneNumber" placeholder="971 00 000 0000" value={ customerNumber } onChange={ (phone) => setCustomerNumber(phone) } />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-4">
                                    <label className="font-weight-semibold">Order Date <span className="c-failed" title="Required">*</span></label>
                                    <DatePicker
                                        className="form-control"
                                        dateFormat="MMMM d, yyyy"
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
                                            dateFormat="MMMM d, yyyy"
                                            selected={ deliveryDate }
                                            onChange={ date => setDeliveryDate(date) }
                                            todayButton="Today"
                                            minDate={ orderDate }
                                        />
                                    </div>
                                </div>
                            </div>

                            <h4 className="card-title">Order Details</h4>

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
                                    <Button title="Add Product"
                                        className="btn btn-theme btn-labeled"
                                        onClick={ () => addProduct() }
                                        disabled={
                                            selectedProductType.name === defaultProductType.name || selectedProduct.name === defaultProduct.name
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
                </div>

                <div className="col-md-4">

                    <Card>

                        <div className="card-body order-total-padding">

                            <h4 className="card-title"
                                style={ { marginBottom: "40px" } }
                            >Order Summary</h4>

                            <div className="row justify-content-between align-items-center" style={ { marginBottom: "20px" } }>
                                <div className="col-md-4">
                                    <label className="font-weight-semibold">Advance Payment: </label>
                                </div>
                                <div className="col-md-4 text-right">
                                    <CurrencyInput className="form-control" suffix=" AED" precision="0" value={ advancePayment } onChangeEvent={ (event, value, maskedValue) => onAdvancePaymentChange(event, value, maskedValue) } />

                                </div>
                            </div>

                            <div className="row justify-content-between" style={ { marginBottom: "10px" } }>
                                <div className="col-md-4">
                                    <label className="font-weight-semibold">Balance Amount: </label>
                                </div>
                                <div className="col-md-4 text-right">
                                    <label className="font-weight-semibold">{ formatter.format(balanceAmount) } AED</label>
                                </div>
                            </div>

                            <div className="row justify-content-between" style={ { marginBottom: "10px" } }>
                                <div className="col-md-4">
                                    <label className="font-weight-semibold">Tax: </label>
                                </div>
                                <div className="col-md-4 text-right">
                                    <label className="font-weight-semibold">{ formatter.format(tax) } AED</label>
                                </div>
                            </div>

                            <hr style={ { marginTop: "20px", marginBottom: "20px", marginLeft: "10px", marginRight: "10px" } } />

                            <div className="row justify-content-between">
                                <div className="col-md-4">
                                    <label className="font-weight-black font-s-18">Total: </label>
                                </div>
                                <div className="col-md-4 text-right">
                                    <label className="font-weight-black font-s-18">{ formatter.format(balanceAmount + tax - advancePayment) } AED</label>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12">

                                    <Button title="Confirm Order"
                                        className="btn btn-theme btn-labeled"
                                        size="lg"
                                        block
                                        style={ { marginTop: "50px", marginBottom: "40px" } }
                                        onClick={ () => placeOrder() }
                                        disabled={
                                            orderProducts.length === 0 || customerName === "" || customerNumber === ""
                                        }
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
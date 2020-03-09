import React from 'react';


export function OrderProduct(props) {

    var formatter = new Intl.NumberFormat('en-US');

    return (
        <div>
            { props.orderProducts.map((product, index) => {

                return <div key={ index } className="row">
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
            }

            ) }
        </div>)


}

export function OrderProductHeader(props) {

    return (
        <div className="row">
            { props.headers.map((header, index) =>

                <div key={ index } className="col-md-2">
                    <label className="font-weight-bold">{ header }</label>
                </div>

            ) }
        </div>
    )


}

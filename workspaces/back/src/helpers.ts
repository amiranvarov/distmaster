export function renderProductsList (products, customerType = 'shop') {
    let msg = '';
    let totalPrice = 0;

    products.map((product, index) => {
        const price = product.price[customerType];
        const { quantity, size, name, flavor, pack } = product;
        if (index === 0){
            msg += '---------------------\n';
        }
        msg += `<b>№${index + 1} ${name}</b> ${size} ${flavor || ''} \n`;
        msg += `${quantity.toLocaleString()} * ${pack} * ${price.toLocaleString()} = ${ (quantity * pack *  price).toLocaleString()}\n`;
        totalPrice += (quantity * pack *  price);

        msg += '---------------------\n';
    });
    msg += `\n<b>Итого</b>: ${totalPrice.toLocaleString()}`;
    return msg;
}

export function getOrderTotalPrice (products, clientType = 'shop') {
    let orderPrice = 0;

    products.map((product) => {
        let {quantity, price, pack} = product;

        price = price[clientType];
        const amount = (price * pack * quantity);
        orderPrice = orderPrice + amount;
    });
    return orderPrice
}

export function generateProductName (product) {
    let {name, size, flavor} = product;
    return `${name} ${size || ''} ${flavor || ''}`;
}

export function getProductRowCost (product, clientType = 'shop') {
    return (product.price[clientType] * product.pack * product.quantity)
}

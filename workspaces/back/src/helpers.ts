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

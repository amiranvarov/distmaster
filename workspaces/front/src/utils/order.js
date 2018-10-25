

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



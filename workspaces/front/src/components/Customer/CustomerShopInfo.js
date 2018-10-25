import React from 'react'

const CustomerShopInfo = ({user}) => {
  const { shop } = user;

  return (
    <div>
      <div>
        <small><strong>Название магазина</strong></small>
        <br /> {shop.name}
      </div>
      <div>
        <small>
          <strong>Юр. Название:</strong></small>
        <br /> {shop.legal_name}
      </div>
      <div>
        <small><strong>Адрес:</strong></small>
        <br /> {shop.location_text}
      </div>
      <div>
        <small><strong>Регион:</strong></small>
        <br /> {shop.region}
      </div>
      <div>
        <small><strong>Имя пользователя:</strong></small>
        <br /> { user.name}
      </div>
      <div>
        <small><strong>Телефон:</strong></small>
        <br /> { user.phone}
      </div>
    </div>
  );
}

export default CustomerShopInfo

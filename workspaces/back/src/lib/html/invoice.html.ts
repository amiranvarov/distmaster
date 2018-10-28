import * as Path from 'path'
import {getOrderTotalPrice, getProductRowCost} from '../../helpers'

function getColaLogoPath () {
    return Path.join(__dirname, '../../../assets/cola-logo.png')
}
function getQRCodePath () {
    return Path.join(__dirname, '../../../assets/qr-code.png')
}

/**
 * products = {name, unit, amount}
 *
 * order_number
 * order_date = {day, month (word)}
 *
 * contract_number
 * contract_date
 */
export const getHTML = ({order, contract, products, shop, phone}) => {

    let HTML = `<html>
  <head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type">

    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html, body {
        display: flex;
        flex: 1;
        font-size: 14px;
      }
      .wrapper {
        width: 100%;
        max-width: 768px;
        margin: 0 auto;
      }
      .branding {
        width: 100%;
        justify-content: space-between;
        align-items: center;
        display: flex;
        height: 150px;
      }

      .heading {
        margin-bottom: 25px;
      }
      img {
        width: 100px;
        height: auto;
        display: inline-block;
      }
      .underline {
        text-decoration: underline;
        text-align: center;
      }
      .text-center {
        text-align: center;
      }
      .text-right {
        text-align: right;
      }
      .m-bottom {
        margin-bottom: 16px;
      }
      
      .float-left {
        float: left;
      }

      .float-right {
        float: right;
      }

      .logo {
        margin-top: 10px;
      }

      .qr {
        width: 50px;
      }

      th {
        padding: 10px;
      }

      table {
        border-collapse: collapse;
        width: 100%;
      }
      table, th, td {
        border: 1px solid black;
        font-size: 14px;
        padding: 2px;
        font-size: 12px;
      }

      table.info th {
        text-align: left;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="branding">
        <img src="${getColaLogoPath()}" class="logo float-left" />
        <img src="${getQRCodePath()}" class="qr float-right" />
      </div>

      <div class="heading">
        <h3 class="text-center m-bottom">Счет на оплату</h3>
        <h4 class="text-center m-bottom"> Спецификация №
          <span class="underline">${order.number}</span> от «<span class="underline">${order.date.day}</span>»
          <span class="underline"> ${order.date.month}</span> ${order.date.year}г
        </h4>
        <h4 class="text-center m-bottom"> к договору - поставки №
          <span class="underline">${contract.number}</span> от «<span class="underline">${contract.date.day}</span>»
          <span class="underline"> ${contract.date.month}</span> ${contract.date.year}г
        </h4>
      </div>

      <table class="info">
        <thead>
          <tr>
            <th>Продавец: ООО “BETMASTER”</th>
            <th>Покупатель: ${shop.legal_name}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="width: 50%">
              Адрес: ул. Олтинтопган 8В, 45/46, г.Ташкент, 100033, Республика Узбекистан
              <br />Р.С: 22626000700912412001
              <br />в НБ ВЭД РУз ТЦОО
              <br />
              <br />
              <div>
                <span style="margin-right: 6px;">МФО: 00882</span>
                <span style="margin-right: 6px;">ИНН: 305711654</span>
                <span style="margin-right: 6px;">ОКЭД: 49410</span>
              </div>
              Тел: +99899 821 81 01
            </td>
            <td>
              Адрес: ${shop.location_text}
              <br />Р.С: ${shop.bank_account_number}
              <br />Наименование банка: ${shop.bank_name}
              <br />
              <br />
              <div>
                <span style="margin-right: 6px;">МФО: ${shop.mfo}</span>
                <span style="margin-right: 6px;">ИНН: ${shop.inn}</span>
                <span style="margin-right: 6px;">ОКЭД: ${shop.oked}</span>
              </div>
              Тел: ${phone}
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <br />
      <table class="products">
        <thead>
          <tr>
            <th>№</th>
            <th>Наименование</th>
            <th>Ед. из.</th>
            <th>Кол-во</th>
            <th>Цена</th>
            <th>сумма</th>
        </thead>
        <tbody>`;

    products.map((product, index) => {
        HTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${product.name} ${product.flavor ? product.flavor : ''} ${product.size} (${product.pack} бут)</td>
                <td>блок</td>
                <td class="text-right">${product.quantity}</td>
                <td class="text-right">${product.price.shop.toLocaleString()}</td>
                <td class="text-right">${getProductRowCost(product).toLocaleString()}</td>
              </tr>`
    })

    HTML += ` 
          <tr>
            <td colspan="6">
              ИТОГО

              <span class="float-right">${getOrderTotalPrice(products).toLocaleString()}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <br />
      <h4>Руководитель: ______________</h4>
      <br />
      <h4> Гл. бухгалтер: ______________</h4>
      <small>М.П.</small>
    </div>
  </body>
</html>`

    return HTML;

};

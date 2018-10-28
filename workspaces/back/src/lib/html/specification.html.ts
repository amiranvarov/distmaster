import * as Path from 'path'

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
export const getHTML = ({order, contract, products}) => {

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

      table {
        border-collapse: collapse;
        width: 100%;
      }

      table, th, td {
        border: 1px solid black;
        font-size: 14px;
        padding: 5px;
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


    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="branding">
        <img src="${getColaLogoPath()}" class="logo float-left" />
        <img src="${getQRCodePath()}" class="qr float-right" />
      </div>

      <div class="heading">
        <h4 class="text-center m-bottom"> Спецификация №
          <span class="underline">${order.number}</span> от «<span class="underline">${order.date.day}</span>»
          <span class="underline"> ${order.date.month}</span> ${order.date.year}г
        </h4>
        <h4 class="text-center m-bottom"> к договору - поставки №
          <span class="underline">${contract.number}</span> от «<span class="underline">${contract.date.day}</span>»
          <span class="underline"> ${contract.date.month}</span> ${contract.date.year}г
        </h4>
      </div>

      <table>
        <thead>
          <th>№</th>
          <th>Наименование</th>
          <th>Ед. из.</th>
          <th>Цена</th>
        </thead>
        <tbody>`;

        products.map((product, index) => {
            return (
                HTML += `
                  <tr>
                    <td class="text-center">${index + 1}</td>
                    <td>${product.name} ${product.flavor ? product.flavor : ''} ${product.size} (${product.pack} бут)</td>
                    <td>блок</td>
                    <td class="text-right">${product.price.shop.toLocaleString()}</td>
                  </tr>
                `
            )
        })

          HTML +=
        `</tbody>
      </table>
      <br/>
      <br/>
      <div class="stamp-area">
        <div class="float-left">М.П. ___________________________</div>
        <div class="float-right">М.П. ___________________________</div>
      </div>
    </div>
  </body>
</html>`;

    return HTML;
};



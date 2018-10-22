import * as phantom from 'phantom-html-to-pdf'
import { BOT } from './Messanger'
import Basket from './Basket'
import DB from '../db'
import * as moment from 'moment'


const conversion = phantom({
    phantomPath: require("phantomjs-prebuilt").path,
    paperSize: {
        format: 'A4'
    }
});

function generateHTML (products, {invoiceId, date}) {
    let totalAmount = 0;
    let HTML = '' +
        '<html>\n' +
        '  <head>\n' +
        '    <meta content="text/html; charset=utf-8" http-equiv="Content-Type">\n' +
        '<style>' +
        '   table {width: 100%; margin-bottom: 1rem; border-collapse: collapse}' +
        '   .table-body td { border-bottom: 1px solid #dee2e6;}'+
        '   thead th { border-bottom: 2px solid #dee2e6;}'+
        '   body {font-family: Arial; font-size: 14px;} ' +
        '   th {vertical-align: bottom;  font-size: 12px; text-align: left; padding: .5rem;}' +
        '   td {vertical-align: center; font-size: 12px; padding: .5rem;}' +
        '</style>' +
        '  </head>\n' +
        '  <body>' +
        `<h3>Договор №${invoiceId} от ${date}</h3>` +
        '<br>' +
        '<table>' +
        '<thead>' +
        '<tr>' +
        '   <th>№</th>'+
        '   <th>Наименование</th>' +
        '   <th>Количество</th>' +
        '   <th>Цена за единицу</th>' +
        '   <th>Цена общая сумма</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody class="table-body">';


            products.map((product, index) => {
                let {name, quantity, price, pack, size, flavor} = product;
                price = Basket.getPriceForUserType(product);
                const title = `${name} ${size || ''} ${flavor || ''}`;
                const amount = (price * pack * quantity);
                totalAmount = totalAmount + amount;


                HTML +='<tr>' +
                    `   <td>${index + 1}</td>` +
                    `   <td>${title} </td>` +
                    `   <td>${quantity.toLocaleString()}</td>` +
                    `   <td>${price.toLocaleString()}</td>` +
                    `   <td>${amount.toLocaleString()}</td>` +
                    '</tr>'
            });
        HTML += '</tbody>' +
        '<tfooter>' +
        '<tr>' +
        '   <td></td>' +
        '   <td>Итого</td>' +
        '   <td></td>' +
        '   <td></td>' +
        `   <td>${totalAmount.toLocaleString()}</td>` +
        '</tr>' +
        '</tfooter>'+
        '</table>' +
        '  </body>\n' +
        '</html>' +
        '';

    return HTML
}

async function generateInvoiceId () {
    return await DB.getNextSequenceValue('invoiceid');
}

export async function sendInvoice(userId: string, products) {
    const invoiceId = await generateInvoiceId();
    const date = moment().format('DD.MM.YYYY');

    const html = generateHTML(products, {invoiceId, date});

    conversion({ html }, function(err, pdfFileStream) {
        BOT.sendDocument(userId, pdfFileStream.stream)
    });
}

import * as phantom from 'phantom-html-to-pdf'
import { BOT } from './Messanger'
import Basket from './Basket'
import DB from '../db'
import * as moment from 'moment'
import * as Specification from './html/specification.html'
import * as Invoice from './html/invoice.html'



const conversion = phantom({
    phantomPath: require("phantomjs-prebuilt").path,
    paperSize: {
        format: 'A4',
        margin: {
            top: '50px',
            left: '100px',
            right: '100px'
        }
    }
});



export async function sendSpecification ({userId, products, contract, order}) {

    conversion({
        html: Specification.getHTML({products, contract, order}),
        allowLocalFilesAccess: true },
        function(err, pdfFileStream) {
            BOT.sendDocument(userId, pdfFileStream.stream, {caption: 'Спецификация'})
    });
}

export async function sendInvoice ({userId, products, contract, order, phone, shop}) {
    conversion({
            html: Invoice.getHTML({products, contract, order, phone, shop}),
            allowLocalFilesAccess: true },
        function(err, pdfFileStream) {
            BOT.sendDocument(userId, pdfFileStream.stream, {caption: 'Счет на оплату'})
        });
}

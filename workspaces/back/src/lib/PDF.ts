import * as phantom from 'phantom-html-to-pdf'
import { BOT } from './Messanger'
import Basket from './Basket'
import DB from '../db'
import * as moment from 'moment'
import * as Specification from './html/specification.html'
import * as Invoice from './html/invoice.html'
import {uploadToS3} from './S3'
import {convert} from './Converter'
import * as fs from 'fs'



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
        async function(err, pdfFileStream) {
            BOT.sendDocument(userId, pdfFileStream.stream, {caption: 'Спецификация'})
    });
}

export async function sendInvoice ({userId, products, contract, order, phone, shop}) {
    /**
     * send file to S3
     * remove file from temp folder
     */
    const fileName = `${contract.number}_${order.number}.pdf`;
    const html = Invoice.getHTML({products, contract, order, phone, shop});
    const file = <string> await convert({fileName, html });
    const uploadResut = await uploadToS3(file, fileName);
    await BOT.sendDocument(userId, file, {caption: 'Спецификация'})
    fs.unlinkSync(file);
}

export async function getInvoiceFile ({userId, products, contract, order, phone, shop}) {

    const fileName = `${contract.number}_${order.number}.pdf`;
    const html = Invoice.getHTML({products, contract, order, phone, shop});
    const file = <string> await convert({fileName, html });
    const fileURL = await uploadToS3(file, fileName);
    fs.unlinkSync(file);
    return fileURL;
}

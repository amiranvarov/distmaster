import * as phantom from 'phantom-html-to-pdf';
import * as fs from 'fs'
import * as path from 'path'

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


export async function convert ({html, fileName}){
    return new Promise((resolve, reject) => {
        const tempPathName = path.resolve('./assets/');
        const fullFilePath = path.join(tempPathName, fileName);

        const outPutFile = fs.createWriteStream(fullFilePath)
        conversion({
                html,
                allowLocalFilesAccess: true },
            async function(err, pdfFileStream) {
                if (err)
                    return reject(err);

                await pdfFileStream.stream.pipe(outPutFile);
                outPutFile.on('finish', () => {
                    resolve(fullFilePath);
                });
            })
    })
}

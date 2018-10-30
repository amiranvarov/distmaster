
require('dotenv').config();

import Messanger from './lib/Messanger'
import DB from './db'
import * as express from 'express'
import * as path from 'path'
import * as Handlers from './Server/controllers'
import * as bodyParser from 'body-parser'


const PORT = process.env.PORT || 4001;
const REACT_BUNDLE_LOCATION = path.resolve('../front/build');

(async function () {

    console.log('REACT_BUNDLE_LOCATION', REACT_BUNDLE_LOCATION);

    express()
        .use(bodyParser.json())
        .use(express.static(REACT_BUNDLE_LOCATION))
        .get('/test', (req, res) => res.send('hello world'))
        .post('/api/auth', Handlers.login)
        .get('/api/orders', Handlers.fetchList)

        .post('/api/orders/:orderId/approve', Handlers.approve)
        .post('/api/orders/:orderId/reject', Handlers.reject)
        .get('*', function (request, response) {
            response.sendFile(path.resolve(__dirname, '../../front/build/index.html'));
        })
        .listen(PORT, () => console.log(`Listening on ${ PORT }`));

    const messenger = new Messanger();
    await messenger.listen();
    await DB.init()

})();


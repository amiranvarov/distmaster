import Messanger from './lib/Messanger'
import DB from './db'
import * as express from 'express'
import * as path from 'path'
import * as Handlers from './Server/controllers'
import * as bodyParser from 'body-parser'


const PORT = process.env.PORT || 4001;
const REACT_BUNDLE_LOCATION = path.resolve('../front/build');

(async function () {

    express()
        .use(bodyParser.json())
        .use(express.static(REACT_BUNDLE_LOCATION))
        .get('/test', (req, res) => res.send('hello world'))
        .post('/auth', Handlers.login)
        .get('/orders', Handlers.fetchList)

        .post('/orders/:orderId/approve', Handlers.approve)
        .post('/orders/:orderId/reject', Handlers.reject)
        .listen(PORT, () => console.log(`Listening on ${ PORT }`));

    const messenger = new Messanger();
    await messenger.listen();
    await DB.init()

})();


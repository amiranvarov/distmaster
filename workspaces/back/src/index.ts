import Messanger from './lib/Messanger'
import DB from './db'
import * as express from 'express'
import * as path from 'path'
import * as Handlers from './Server/controllers'
import * as bodyParser from 'body-parser'


const PORT = process.env.PORT || 4000;
const REACT_BUNDLE_LOCATION = path.resolve('../front/build');

(async function () {

    express()
        .use(bodyParser.json())
        .use(express.static(REACT_BUNDLE_LOCATION))
        .get('/test', (req, res) => res.send('hello world'))
        .post('/auth', Handlers.login)
        .listen(PORT, () => console.log(`Listening on ${ PORT }`));

    const messenger = new Messanger();
    await messenger.listen();
    await DB.init()

})();


import Messanger from './lib/Messanger'
import DB from './db'
import * as express from 'express'
import * as path from 'path'


const PORT = process.env.PORT || 3003;
const REACT_BUNDLE_LOCATION = path.resolve('../front/build');

(async function () {

    express()
        .use(express.static(REACT_BUNDLE_LOCATION))
        .get('/test', (req, res) => res.send('hello world'))
        .listen(PORT, () => console.log(`Listening on ${ PORT }`));

    const messenger = new Messanger();
    await messenger.listen();
    await DB.init()

})();


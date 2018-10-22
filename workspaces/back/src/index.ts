import Messanger from './lib/Messanger'
import DB from './db'
import * as express from 'express'



(async function () {

    const PORT = process.env.PORT || 3000;
    express()
        .get('/test', (req, res) => res.send('hello world'))
        .listen(PORT, () => console.log(`Listening on ${ PORT }`));

    const messanger = new Messanger();
    await messanger.listen();
    await DB.init()

})();


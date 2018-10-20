import Messanger from './lib/Messanger'
import DB from './db'
import * as express from 'express'



(async function () {

    express()
        .get('/test', (req, res) => res.send('hello world'))
        .listen(process.env.PORT, () => console.log(`Listening on ${ process.env.PORT }`));

    // await DB.init();
    const messanger = new Messanger();
    await messanger.listen();
    await DB.init()
    // await Server.listen(config.server.host, config.server.port)
    console.log('Server started!!');

})();


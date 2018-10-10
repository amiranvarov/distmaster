import Messanger from './lib/Messanger'
import DB from './db'



(async function () {
    // await DB.init();
    const messanger = new Messanger();
    await messanger.listen();
    await DB.init()
    // await Server.listen(config.server.host, config.server.port)
    console.log('Server started');

})()


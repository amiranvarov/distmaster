import DB from './db'
import * as SeedProducts from './Data'

(async function () {

    await DB.init();

    await DB.mongo.collection('positions').deleteMany({});
    await DB.mongo.collection('positions').insertMany([
        ...SeedProducts.CocaCola,
        ...SeedProducts.Bliss
    ])

    console.log('Population completed')
})();

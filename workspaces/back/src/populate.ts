import DB from './db'
import * as SeedProducts from './Data/index'

(async function () {

    await DB.init();
    // sequence
    // await DB.mongo.collection('counters').insertOne({
    //     "_id" : "invoiceid", "sequence_value" : 669
    // });

    await DB.mongo.collection('positions').deleteMany({});
    await DB.mongo.collection('positions').insertMany([
        ...SeedProducts.CocaCola,
        ...SeedProducts.Fanta,
        ...SeedProducts.Sprite,
        ...SeedProducts.BonAqua
    ])

    console.log('Population completed')
})();
import DB from './db'
import * as SeedProducts from './Data/index'

(async function () {


    // const users = []
    // for (let i = 0; i < 100; i++) {
    //     const user = {
    //         tg_id: i,
    //         name: `User ${i}`,
    //         phone: "998977429052",
    //         shop: {
    //             name: `Shop ${i}`,
    //             legal_name: `Legal ${i}`,
    //             region: 'Ахангаран'
    //         }
    //     }
    //     users.push(user)
    // }
    // await DB.mongo.collection('users').insertMany(users);

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
        ...SeedProducts.BonAqua,
        ...SeedProducts.FuseTea
    ])

    console.log('Population completed')
})();

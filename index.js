const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jodbj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
          console.log('connect to db')
          const database = client.db("tourPlans");
          const plansCollection = database.collection("plans");

        //   GET API

        app.get('/plans', async(req, res) => {
            const cursor = plansCollection.find({});
            const plans = await cursor.toArray();
            res.send(plans);
        });
        // GET SINGLE PLAN
        app.get('/plans/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const plan = await plansCollection.findOne(query);
            res.json(plan);
        })

        //   POST API

         app.post('/plans', async (req, res) => {
             const plan = req.body;
           console.log('hit the post api', plan)
             const result = await plansCollection.insertOne(plan);
             console.log(result)
            res.json(result)
         });

        //  DELETE API
        app.delete('/plans/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })

    } finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Tour travel server is running');
});

app.listen(port, () => {
    console.log('Server running at port', port);
})
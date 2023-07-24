const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.Port || 5000;

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ae6qagl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const fresherJobCollection = client.db("jobportalDb").collection("freshjob");
        const experiencedJobCollection = client.db("jobportalDb").collection("expjob");
        const companyCollection = client.db("jobportalDb").collection("itcompanies");

        app.get('/freshjob', async (req, res) => {
            const result = await fresherJobCollection.find().toArray();
            res.send(result);
        });

        app.get('/job/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const options = {
                // Include only the `title` and `imdb` fields in the returned document
                projection: { comapny_name: 1, company_logo: 1, positon_name: 1, location: 1 },
              };

            const result = await fresherJobCollection.findOne(query, options);
            res.send(result);
        });

        app.get('/expjob', async (req, res) => {
            const result = await experiencedJobCollection.find().toArray();
            res.send(result);
        });

        app.get('/itcompanies', async (req, res) => {
            const result = await companyCollection.find().toArray();
            res.send(result);
        });

        
        
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('job portal is running....')
})

app.listen(port, () => {
    console.log(`Job Portal is running on port ${port}`);
})
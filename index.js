const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 3000
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://userMangement:userMangement@cluster0.2m0rny5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
     await client.connect();
    const usersDb = await client.db('userManagement').collection('users')
     app.post('/users', async(req, res) => {
        const user = await req.body
        const result = await usersDb.insertOne(user)
        res.send(result)
        console.log(user)
     })
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Welcome server')
})

app.listen(port, () => {
    console.log(`Welcome server ${port}`)
})
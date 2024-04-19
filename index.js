const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    // data send
    app.post('/users', async(req, res) => {
        const user = await req.body
        const result = await usersDb.insertOne(user)
        res.send(result)
     })
    //  get all data
    app.get('/users', async(req, res) => {
      const result = await usersDb.find().toArray()
      res.send(result)
    })
    // delete single data
    app.delete('/users/:id', async(req, res) => {
      const id = await req.params.id
      const query = await {_id: new ObjectId(id)}
      const result = await usersDb.deleteOne(query)
      res.send(result)
    })
    // get single user data
    app.get('/users/:id', async (req, res) => {
      const id = await req.params.id
      const query = await {_id: new ObjectId(id)}
      const result = await usersDb.findOne(query)
      res.send(result)
    })
    // update single data
    app.put('/users/:id', async (req, res) => {
      const id = req.params.id
      const user = req.body
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedUser = {
        $set: {
          name: user.name,
          location: user.location,
          email: user.email,
          phone: user.phone
        }
      }
      const result = await usersDb.updateOne( filter, updatedUser,options)
      res.send(result)
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
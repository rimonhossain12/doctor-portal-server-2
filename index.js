const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());

// data base is connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5bitd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{
        await client.connect();
        // const database = client.db('doctor')
        console.log('database is connecting');
    }
    finally{

    }
}
run().catch(console.dir);

app.get('/',(req,res) => {
    res.send('Hello Doctor Portal!');
})

app.listen(port,() => {
    console.log('Running On port',port);
})
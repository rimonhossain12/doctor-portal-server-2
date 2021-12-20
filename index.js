const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// data base is connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5bitd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('doctors_portal2');
        const appointmentsCollection = database.collection('appointments');
        const usersCollection = database.collection('users');

        app.get('/appointments', async (req, res) => {
            const email = req.query.email;
            const date = new Date(req.query.date).toLocaleDateString();
            const query = { email: email, date };
            const cursor = appointmentsCollection.find(query);
            console.log('query = ', query);
            const appointments = await cursor.toArray();
            console.log(appointments);
            res.json(appointments);
        })

        app.post('/appointments', async (req, res) => {
            const appointment = req.body;
            const result = await appointmentsCollection.insertOne(appointment);
            res.json(result);
        });

        app.post('/users',async(req,res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log('result found',result);
            res.json(result);
        });

        app.put('/users',async(req,res) => {
            const user = req.body;
            console.log('Put',user);
            const filter = {email:user.email};
            const options = { upsert: true };
            const updateDoc = {$set:user};
            const result = await usersCollection.updateOne(filter,updateDoc,options);
            console.log(result);
            res.json(result);

        })
    }
    finally {
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Doctor Portal!');
})

app.listen(port, () => {
    console.log('Running On port', port);
})

    // 01 / Hope(Faizan Hashmi)
    // 02 / Ahat Islam
    // 03 / Alone
    // 04 / My Hope
    // 05 / Wave Traps(Dirlis Artugrul)
    // 06 / Enta Malaak(Mohamed Alomari)
    // 07 / Greatfull
    // 08 / Allahu Labbayk
    // 09 / Sweet Love
    // 10 / Working Hard
    // 11 / Make me strong instrumental(Sami Yusuf)
    // 12 / Deep in love
    // 13 / Yusuf Jhulakha
    // 14 / موسيقى إسلامية هادئة(Goldenmac)
    // 15 / Willy Lerator
    // 16 / Plevna Marsi(Kurlus Osman)
    // 17 / Alveda 2(Mehrab)
    // 18 / Music Islam
    // 19 / Ottoman Sufi
    // 20 / Insallah(Maher Zain)
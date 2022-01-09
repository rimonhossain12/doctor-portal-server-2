const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
require('dotenv').config()
const cors = require('cors');
const { request } = require('express');
const ObjectId = require('mongodb').ObjectId;
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const fileUpload = require('express-fileupload');


const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// data base is connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5bitd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('doctors_portal2');
        const appointmentsCollection = database.collection('appointments');
        const usersCollection = database.collection('users');
        const doctorsCollection = database.collection('doctors');

        app.get('/appointments', async (req, res) => {
            const email = req.query.email;
            const date = new Date(req.query.date).toLocaleDateString();
            const query = { email: email, date };
            const cursor = appointmentsCollection.find(query);
            const appointments = await cursor.toArray();
            res.json(appointments);
        });

        app.get('/doctors',async(req,res) => {
            const cursor = doctorsCollection.find({});
            const doctors = await cursor.toArray();
            res.json(doctors);
        })

        app.post('/doctors',async(req,res) => {
            const name = req.body.name;
            const email = req.body.email;
            const pic = req.files.image;
            const picData = pic.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic,'base64');
            const doctor = {
                name,
                email,
                image:imageBuffer
            }
            const result = await doctorsCollection.insertOne(doctor);
            res.json(result);
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            } res.json({ admin: isAdmin });
        });
        
        app.get('/appointments/:id',async(req,res) => {
            const id = req.params.id;
            console.log('found id',id);
            const query = {_id: ObjectId(id)};
            const result = await appointmentsCollection.findOne(query);
            res.json(result);
        })
        app.post('/appointments', async (req, res) => {
            const appointment = req.body;
            const result = await appointmentsCollection.insertOne(appointment);
            res.json(result);
        });

        // update appointment
        app.put('/appointments/:id',async(req,res) => {
            const id = req.params.id;
            const payment = req.body;
            const filter = {_id: ObjectId(id)};
            const updateDoc = {
                $set:{
                    payment:payment
                }
            };
            const result = await appointmentsCollection.updateOne(filter,updateDoc);
            res.json(result);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.post('/create-payment-intent',async(req,res) => {
            const paymentInfo = req.body;
            const amount = paymentInfo.price *100;
            const paymentIntent = await stripe.paymentIntents.create({
                currency: "usd",
                amount:amount,
                payment_method_types:['card']
            });
            res.json({ clientSecret: paymentIntent.client_secret});
        });
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
    // 20 / Insallah(Maher Zain);
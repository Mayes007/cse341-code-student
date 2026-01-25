const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

let db;

async function connectDB() {
  await client.connect();
  db = client.db('contactsDB');
  console.log('Connected to MongoDB');
}

connectDB();

app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use('/contacts', require('./routes/contacts'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

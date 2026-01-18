const { MongoClient } = require("mongodb");
require("dotenv").config();

let db;

const connectDB = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db();
  console.log("MongoDB connected");
};

const getDB = () => db;

module.exports = { connectDB, getDB };

const { MongoClient } = require("mongodb");
require("dotenv").config();

let database;

const connectDB = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  database = client.db();
  console.log("MongoDB connected");
};

const getDB = () => database;

module.exports = { connectDB, getDB };

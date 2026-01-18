const { ObjectId } = require("mongodb");
const { getDB } = require("../db/connect");

// GET all contacts
const getAllContacts = async (req, res) => {
  const contacts = await getDB()
    .collection("contacts")
    .find()
    .toArray();

  res.json(contacts);
};

// GET contact by ID
const getContactById = async (req, res) => {
  const id = req.query.id;

  const contact = await getDB()
    .collection("contacts")
    .findOne({ _id: new ObjectId(id) });

  res.json(contact);
};

module.exports = {
  getAllContacts,
  getContactById
};

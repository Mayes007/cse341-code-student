const { ObjectId } = require('mongodb');
const { createContact } = require('../models/contact');

exports.createContact = async (req, res) => {
  const contact = createContact(req.body);

  const result = await req.db.collection('contacts').insertOne(contact);
  res.status(201).json({ id: result.insertedId });
};

exports.updateContact = async (req, res) => {
  const id = new ObjectId(req.params.id);

  await req.db.collection('contacts').updateOne(
    { _id: id },
    { $set: req.body }
  );

  res.sendStatus(204);
};

exports.deleteContact = async (req, res) => {
  const id = new ObjectId(req.params.id);

  await req.db.collection('contacts').deleteOne({ _id: id });

  res.sendStatus(200);
};

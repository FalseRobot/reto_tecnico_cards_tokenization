import { Document, Schema, Model, model } from 'mongoose';
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {})

const cardSchema = new Schema({
  card_number: String,
  cvv: String,
  expiration_month: String,
  expiration_year: String,
  email: String,
  createdAt: Date,
  token: String
});

const Card = model('Card', cardSchema);

export default Card;
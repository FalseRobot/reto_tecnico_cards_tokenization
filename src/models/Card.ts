import { Document, Schema, Model, model } from 'mongoose';
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin2:vybhdZVN9m@cluster0.gywv7oz.mongodb.net/tokenizacion_tarjetas', {})

const cardSchema = new Schema({
  card_number: String,
  cvv: String,
  expiration_month: String,
  expiration_year: String,
  email: String,
  createdAt: Date,
});

const Card = model('Card', cardSchema);

export default Card;
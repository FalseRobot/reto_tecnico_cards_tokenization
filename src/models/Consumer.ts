import { Document, Schema, Model, model } from 'mongoose';
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {})

const consumerSchema = new Schema({
  pk: String,
  name: String
});

const Consumer = model('Consumer', consumerSchema);

export default Consumer;
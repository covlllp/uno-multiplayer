import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const schema = new Schema({
  name: { type: String },
  isReady: { type: Boolean, default: false },
  cards: [{ type: ObjectId, ref: 'Card' }],
});

mongoose.model('Player', schema);

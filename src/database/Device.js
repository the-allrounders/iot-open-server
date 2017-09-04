import mongoose, { Schema } from 'mongoose';

const device = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  name: {type: String, required: true},
  location: {
    latitude: Number,
    longitude: Number,
  },
  token: { type: String, required: true },
  dataTypes: [{
    _id: false,
    key: { type: String, required: true },
    type: { type: String, required: true },
  }]
});

export default mongoose.model('Device', device);
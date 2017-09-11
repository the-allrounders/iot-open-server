import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';

const token = () => (crypto.randomBytes(12)).toString('hex');

const device = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  actuator: { type: String, required: false, default: ""},
  location: {
    latitude: Number,
    longitude: Number,
  },
  token: { type: String, required: true, default: token },
  dataTypes: [{
    _id: false,
    label: { type: String, required: true },
    key: { type: String, required: true },
    type: { type: String, required: true },
  }],
}, {
  timestamps: true,
});

export default mongoose.model('Device', device);

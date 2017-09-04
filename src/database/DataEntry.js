import mongoose, { Schema } from 'mongoose';

const dataEntry = new Schema({
  device: { type: Schema.Types.ObjectId, ref: 'Device', required: true },
  data: [{
    _id: false,
    key: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
  }],
}, {
  timestamps: true,
});

export default mongoose.model('DataEntry', dataEntry);

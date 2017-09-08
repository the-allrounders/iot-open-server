import mongoose, { Schema } from 'mongoose';

const dataEntry = new Schema({
  device: { type: Schema.Types.ObjectId, ref: 'Device', required: true, index: true },
  data: [{
    _id: false,
    key: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
  }],
}, {
  timestamps: true,
});

dataEntry.index({ device: 1, 'data.key': 1, _id: -1 });

export default mongoose.model('DataEntry', dataEntry);

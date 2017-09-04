import mongoose, { Schema } from 'mongoose';

const user = new Schema({
  googleId: String,
  name: String,
}, {
  timestamps: true,
});

export default mongoose.model('User', user);

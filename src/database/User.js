import mongoose, { Schema } from 'mongoose';
import Device from './Device';
import crypto from 'crypto';

const user = new Schema({
  googleId: String,
  name: String,
});

user.post('findOneAndUpdate', async (user) => {
  if (!await Device.count({ user: user.id }).exec()) {
    const token = (await crypto.randomBytes(12)).toString('hex');
    const device = new Device({
      user: user.id,
      name: user.name,
      token,
      dataTypes: [
        {
          key: 'number',
          type: 'number',
        },
        {
          key: 'text',
          type: 'text',
        },
      ],
    });
    device.save();
  }
});

export default mongoose.model('User', user);

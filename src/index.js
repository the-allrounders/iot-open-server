import mongoose from 'mongoose';
import server from './server';

mongoose.Promise = Promise;

if (!process.env.MONGODB_URI) {
  console.error('No MONGODB_URI found.');
  process.exit(1);
}
if (!process.env.PORT) {
  console.error('No PORT found.');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true }).then(() => {
  console.log('CONNECTED TO DB.');
  server.listen(process.env.PORT, () => 'SERVER STARTED.');
});

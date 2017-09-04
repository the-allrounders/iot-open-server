import express from 'express';
import Device from './database/Device';
import formTemplate from './templates/form';
import listTemplate from './templates/list';
import template from './templates/template';

const middleware = express();

function getDevicesByUserId(user) {
  return Device.find({ user }).sort({ updatedAt: -1}).exec();
}

middleware.get('/', async ({ user, baseUrl }, res) => {
  const devices = await getDevicesByUserId(user._id);
  res.send(template({
    user,
    body: listTemplate({ devices, baseUrl }),
    baseUrl,
  }));
});

middleware.get('/device/add', async ({ user, baseUrl }, res) => {
  const device = new Device({
    user: user.id,
    name: user.name,
    dataTypes: [
      {
        label: 'Temperature',
        key: 'temperature',
        type: 'number',
      },
      {
        label: 'Humidity',
        key: 'humidity',
        type: 'number',
      },
    ],
  });
  await device.save();
  res.redirect(baseUrl);
});

middleware.get('/device/:deviceId', async ({ user, params, baseUrl }, res) => {
  console.log(params);
  const device = await Device.findOne({
    user: user._id,
    _id: params.deviceId,
  }).exec();
  device.dataTypes.push({});
  res.send(template({
    user,
    body: formTemplate({ device, baseUrl }),
    baseUrl,
  }));
});

middleware.post('/device/:deviceId', async ({ user, params, body, baseUrl }, res) => {
  console.log('body', body);
  const dataTypes = body.dataTypes.filter(dataType => dataType.label !== '' && dataType.key !== '' && dataType.type !== '');
  const update = { ...body, dataTypes };
  await Device.findOneAndUpdate({
    user: user._id,
    _id: params.deviceId,
  }, update).exec();
  if(body.submitEdit === 'true') {
    res.redirect(baseUrl + '/device/' + params.deviceId);
  } else {
    res.redirect(baseUrl + '/');
  }
});

middleware.get('/device/:deviceId/delete', async ({ user, params, baseUrl }, res) => {
  await Device.remove({ user: user._id, _id: params.deviceId }).exec();
  res.redirect(baseUrl + '/');
});

export default middleware;

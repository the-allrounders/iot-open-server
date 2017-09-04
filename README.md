# iot-open-server

[![Greenkeeper badge](https://badges.greenkeeper.io/the-allrounders/iot-open-server.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/the-allrounders/iot-open-server.svg?branch=master)](https://travis-ci.org/the-allrounders/iot-open-server)
[![dependencies Status](https://david-dm.org/the-allrounders/iot-open-server/status.svg)](https://david-dm.org/the-allrounders/iot-open-server)

The Internet of Things open webserver.

## Create devices

> You can only create a single device per user at this moment.

If you navigate to the homepage, you are asked to log in with Google. If you are logged in, you can view the token of your device.


## Change data types

> At this moment, you can only have two data keys: "number" and "text". 
> You will soon be able to add and customize all available datasets. You will then be able to push an unlimited amount of datasets (sensors).


## Endpoints

### GET /data

This returns all devices, with the latest values.


### POST /data

You can post JSON data to this endpoint, to add new data to a device.

```json
  {
    "token": "575851ca4d6927f25789ec94",
    "data": [
      {
        "key": "number",
        "value": 20
      },
      {
        "key": "text",
        "value": "Status tekst"
      }
    ]
  }
```

## Development

### Requirements

You need these tools before you can develop this locally:

- MongoDB Server (can also be a remote server)
- Node
- Yarn
- An Google Client ID and Secret

You can generate a Google Client ID and Secret by navigating to https://console.developers.google.com/apis/credentials/oauthclient, selecting 'web application' and entering http://localhost/auth/google/callback in the _Authorized redirect URIs_.

Also, you need to enable the Google Plus API in order for the authentication to work.

### Run

If you want to locally setup this repository, clone it and run `yarn`.

Create an `.env` file in the root of the project with the following contents:
```
MONGODB_URI=mongodb://localhost/iot
PORT=3000
GOOGLE_CLIENT_ID=8950558...
GOOGLE_CLIENT_SECRET=PHfg...
```
Of course, change the MongoDB url and Google Client details to your own.

After that, run `yarn start` and navigate to http://localhost:3000.

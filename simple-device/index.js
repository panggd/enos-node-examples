
const dotenv = require("dotenv");
const { DeviceClient, SECURE_MODE } = require("enos-mqtt-sdk-nodejs");

dotenv.config();

// create client instance
const clientOptions = {
  brokerUrl: process.env.DEV_BROKER_URL,
  secureMode: SECURE_MODE.VIA_DEVICE_SECRET,
  productKey: process.env.PRODUCT_KEY,
  productSecret: process.env.PRODUCT_SECRET,
  deviceKey: process.env.DEVICE_KEY,
  deviceSecret: process.env.DEVICE_SECRET,
  mqttOptions: {
    connectionTimeout: 30,
    reconnectPeroid: 0, // The reconnection is disabled.
    keepAlive: 0 // The keepAlive disalbed.
  }
}

initConnection = async () => {
  try {
    const client = new DeviceClient(clientOptions);

    // listen to 'connect' event
    client.on('connect', () => {
      console.log('connected');
    });

    // listen to 'close' event
    client.on('close', () => {
      console.log('connection closed');
    });

    const deviceSecret = await client.connect();
    console.log(`device secret: ${deviceSecret}`);
    await client.close();
  } catch (err) {
    console.error(err, err.stack);
  }
}

initConnection();
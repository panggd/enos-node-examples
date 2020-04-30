
const dotenv = require("dotenv");
const { GatewayClient, SECURE_MODE } = require("enos-mqtt-sdk-nodejs");

dotenv.config();

// create client instance
const clientOptions = {
  brokerUrl: process.env.PPE_BROKER_URL,
  secureMode: SECURE_MODE.VIA_DEVICE_SECRET,
  productKey: process.env.EDGE_PRODUCT_KEY,
  deviceKey: process.env.EDGE_GATEWAY_KEY,
  deviceSecret: process.env.EDGE_GATEWAY_SECRET,
  mqttOptions: {
    connectionTimeout: 30,
    reconnectPeroid: 0, // The reconnection is disabled.
    keepAlive: 0 // The keepAlive disalbed.
  }
}

initConnection = async () => {
  try {
    const client = new GatewayClient(clientOptions);

    // listen to 'connect' event
    client.on('connect', () => {
      console.log('connected');
    });

    // listen to 'close' event
    client.on('close', () => {
      console.log('connection closed');
    });

    await client.connect();

    // batch login to sub devices
    const loginResponse = await client.subDeviceManagement.batchLoginSubDevice({
      subDevices: [{
        productKey: process.env.SUBDEVICE_PRODUCT_KEY,
        deviceKey: process.env.SUBDEVICE_KEY,
        deviceSecret: process.env.SUBDEVICE_SECRET,
      }]
    });
    console.log('login sub-devices response: ',
      loginResponse);

    let count = 0;
    setInterval(async () => {
      const batchPostSubDevicesMpResponse =
        await client.deviceData.batchPostMeasurepoint({
          points: [{
            measurepoints: {
              temp: 50
            },
            productKey: process.env.SUBDEVICE_PRODUCT_KEY,
            deviceKey: process.env.SUBDEVICE_KEY,
          }]
        });
      console.log('batch post measurepoints of sub-devices response: ',
        batchPostSubDevicesMpResponse);
    }, 1000);
  } catch (err) {
    console.error(err, err.stack);
  }
}

initConnection();
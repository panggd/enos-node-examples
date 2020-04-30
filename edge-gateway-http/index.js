const express = require("express");
const { GatewayClient, SECURE_MODE } = require("enos-mqtt-sdk-nodejs");

const dotenv = require("dotenv");
dotenv.config();

const port = 9000;
let edgeGatewayClient = null;

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(port, () => {
  initEdgeGatewayClient();
  console.log(`Edge gateway listening at http://localhost:${port}`);
});

app.get("/ping", (req, res) => {
  res.send("OK");
});

app.post("/send-data", async (req, res) => {
  // based on subdevice id, get subdevice tuples 
  const deviceID = req.body.deviceID;
  const temp = req.body.temp;
  const [productKey, deviceSecret] = lookUpSubDeviceTuples(deviceID);
  const loginSubDeviceResponse = await edgeGatewayClient
    .subDeviceManagement.loginSubDevice({
      subDevice: {
        productKey: productKey,
        deviceKey: deviceID,
        deviceSecret: deviceSecret
      }
    });

  if (loginSubDeviceResponse.code === 200) {
    const postMpResponse = await edgeGatewayClient
      .deviceData.postMeasurepoint({
        point: {
          measurepoints: {
            temp: temp
          },
          productKey: productKey,
          deviceKey: deviceID,
          time: + new Date()
        }
      });
    console.log('post mp response: ', postMpResponse);
  }

  res.send("success");

});

const lookUpSubDeviceTuples = (deviceID) => {
  const dummySubDeviceMap = {};

  dummySubDeviceMap[process.env.SUBDEVICE_KEY] = {
    productKey: process.env.SUBDEVICE_PRODUCT_KEY,
    deviceSecret: process.env.SUBDEVICE_SECRET
  };

  return Object.values(dummySubDeviceMap[deviceID]);
}

initEdgeGatewayClient = async () => {
  try {
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
    edgeGatewayClient = new GatewayClient(clientOptions);

    // listen to 'connect' event
    edgeGatewayClient.on('connect', () => {
      console.log('connected');
    });

    // listen to 'close' event
    edgeGatewayClient.on('close', () => {
      console.log('connection closed');
    });

    await edgeGatewayClient.connect();
  } catch (err) {
    console.error(err, err.stack);
  }
}
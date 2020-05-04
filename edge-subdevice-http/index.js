const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const EDGE_GATEWAY_URL=`http://${process.env.EDGE_GATEWAY_IP}:${process.env.EDGE_GATEWAY_PORT}/send-data`;

try {
  setInterval(async () => {
    let temp = Math.floor(Math.random() * 101);
    const res = await axios({
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      url: EDGE_GATEWAY_URL,
      data: {
        deviceID: process.env.SUBDEVICE_KEY,
        temp: temp
      }
    });
    console.log(temp, res.data);
  }, 1000);
} catch(err) {
  console.error(err, err.stack);
}


/* NodeJS express template for EnOS ECP serverless function */
const dotenv = require("dotenv");
const express = require("express");
const { Kafka } = require("kafkajs");

dotenv.config({ path: "./config/.env" });

var app = express();
app.use(express.urlencoded({extended: true})); 
app.use(express.text());

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.get("/trigger", async (req, res) => {
  console.log("inside trigger");
  const kafka = new Kafka({
    clientId: "test-kafka-trigger",
    brokers: [
      `${process.env.ECP_TRIGGER_KAFKA_URL1}:${process.env.ECP_TRIGGER_KAFKA_PORT}`,
      `${process.env.ECP_TRIGGER_KAFKA_URL2}:${process.env.ECP_TRIGGER_KAFKA_PORT}`
    ]
  });

  const producer = kafka.producer();

  await producer.connect();
  await producer.send({
    topic: process.env.ECP_TRIGGER_KAFKA_TOPIC,
    messages: [
      { value: `Hello World!, ${new Date()}` },
    ],
  });

  await producer.disconnect();
  res.send("OK");
});

app.post("/callback", function (req, res) {
  console.log("inside callback");
  console.log(req.body);
  res.send("Callback");
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
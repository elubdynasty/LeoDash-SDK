const axios = require("axios");
const config = require('./config.json')
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const body = JSON.stringify({
  external_delivery_id: uuidv4(), // keep track of the generated id here or in the response
  pickup_address: "33348 Alvarado-Niles Rd, Union City, CA 94587",
  pickup_business_name: "Rose Garden Restaurant",
  pickup_phone_number: "+15104895090",
  pickup_instructions: "Enter the lobby aftert you parked",
  dropoff_address: "33597 Colgate Dr, Union City, CA 94587",
  dropoff_business_name: "",
  dropoff_phone_number: "+15104023794",
  dropoff_instructions: "Leave at the door",
  order_value: 20000,
  tip: 2300,
  contactless_dropoff: true,
});

const data = {
  aud: "doordash",
  iss: config.developer_id,
  kid: config.key_id,
  exp: Math.floor(Date.now() / 1000 + 60),
  iat: Math.floor(Date.now() / 1000),
};

const headers = { algorithm: "HS256", header: { "dd-ver": "DD-JWT-V1" } };

const token = jwt.sign(
  data,
  Buffer.from(config.signing_secret, "base64"),
  headers
);



axios
  .post("https://openapi.doordash.com/drive/v2/deliveries", body, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  })
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

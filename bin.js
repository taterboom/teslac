#!/usr/bin/env node

var TeslaClient = require("./TeslaClient")

var access_token = process.argv[2] || process.env.TESLA_ACCESS_TOKEN

var refresh_token = process.argv[3] || process.env.TESLA_REFRESH_TOKEN

var tc = new TeslaClient(access_token, refresh_token)

tc.init()
  .then(() => {
    tc.control(
      tc.vehicles[0].id,
      TeslaClient.ownerApi(`/vehicles/${tc.vehicles[0].id}/data_request/charge_state`)
    ).then(console.log)
  })
  .catch((err) => {
    console.log(err)
  })

#!/usr/bin/env node

var teslac = require("./index")

var access_token = process.argv[2] || process.env.TESLA_ACCESS_TOKEN

var refresh_token = process.argv[3] || process.env.TESLA_REFRESH_TOKEN

teslac(access_token, refresh_token)
  .then((tc) => {
    tc.control(
      tc.vehicles[0].id,
      tc.ownerApi(`/vehicles/${tc.vehicles[0].id}/data_request/charge_state`)
    ).then(console.log)
  })
  .catch((err) => {
    console.log(err)
  })

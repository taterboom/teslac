"use strict"
var teslac = require("teslac")
var mailer = require("./mailer")

function resJson(status, data) {
  return {
    isBase64Encoded: false,
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }
}
exports.main_handler = async (event, context) => {
  if (!process.env.TESLA_ACCESS_TOKEN || !process.env.TESLA_REFRESH_TOKEN) {
    resJson(404, {
      err: null,
      msg: "no access_token or refresh_token",
    })
    return
  }
  return teslac(process.env.TESLA_ACCESS_TOKEN, process.env.TESLA_REFRESH_TOKEN)
    .then((tc) =>
      tc
        .control(
          tc.vehicles[0].id,
          tc.ownerApi(`/vehicles/${tc.vehicles[0].id}/data_request/charge_state`)
        )
        .then((info) => {
          const kilometers = info.battery_range * 1.609344
          if (kilometers < 150) {
            mailer(`kilometers: ${kilometers.toFixed(0)}
            percent: ${info.usable_battery_level}%`)
          }
          resJson(200, info)
        })
        .catch((err) => {
          resJson(404, {
            err,
            msg: "charge_state err",
          })
        })
    )
    .catch((err) => {
      resJson(404, {
        err,
        msg: "init err",
      })
    })
}

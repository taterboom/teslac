const TeslaClient = require("./TeslaClient")

async function teslac(access_token, refresh_token) {
  const tc = new TeslaClient(access_token, refresh_token)
  return tc.init().then(() => tc)
}

exports.TeslaClient = TeslaClient
module.exports = teslac

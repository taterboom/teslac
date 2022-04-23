# teslac

> read your tesla

## Uage

```javascript
// get your tokens form mobile app "Auth for Tesla"(ios) or "Tesla Tokens"(android)
const tc = new TeslaClient(access_token, refresh_token)
// get vehicles
await tc.init()
// control your first vehicle
tc.control(
  tc.vehicles[0].id,
  TeslaClient.ownerApi(`/vehicles/${tc.vehicles[0].id}/data_request/charge_state`)
).then(console.log)
```

## API

- [tesla-api.io](https://www.teslaapi.io/vehicles/state-and-settings)
- [timdorr/tesla-api](https://tesla-api.timdorr.com/api-basics/authentication#post-https-auth.tesla.com-oauth2-v3-token-1)

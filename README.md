# teslac

> read your tesla

## Install

`npm install teslac`

## Uage

```javascript
// get your tokens form mobile app "Auth for Tesla"(ios) or "Tesla Tokens"(android)
teslac(access_token, refresh_token)
  .then((tc) =>
    tc
      .control(
        tc.vehicles[0].id,
        tc.ownerApi(`/vehicles/${tc.vehicles[0].id}/data_request/charge_state`)
      )
      .then(console.log)
  )
  .catch((err) => {
    console.log(err)
  })
```

## Examples

- [cli](./examples/cli)
- [tencent-serverless-function](./examples//tencent-serverless-function/)

## API

- [tesla-api.io](https://www.teslaapi.io/vehicles/state-and-settings)
- [timdorr/tesla-api](https://tesla-api.timdorr.com/api-basics/authentication#post-https-auth.tesla.com-oauth2-v3-token-1)

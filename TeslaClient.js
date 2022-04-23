function checkVersion() {
  if (!fetch) {
    console.error("need node version >18")
  }
}

checkVersion()

async function retry(transactionGenerator, { times = 3, delay = 20000, msg = "" } = {}) {
  let i = 0
  while (i < times) {
    i++
    const res = await transactionGenerator()
    if (res) {
      return res
    }
    await new Promise((res) => setTimeout(res, delay))
  }
  throw new Error(msg)
}

class AjaxError extends Error {
  status
  constructor(status, message, options) {
    super(message, options)
    this.status = status
  }
}

class TeslaClient {
  static OWNER_API_PREFIX = "https://owner-api.teslamotors.com/api/1"
  static REFRESH_API = "https://auth.tesla.cn/oauth2/v3/token"
  static ownerApi(path) {
    return TeslaClient.OWNER_API_PREFIX + path
  }

  access_token
  refresh_token
  vehicles = []

  constructor(access_token, refresh_token) {
    this.access_token = access_token
    this.refresh_token = refresh_token
  }

  async _fetch(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
      },
      body: options.body && JSON.stringify(options.body),
    })
    console.log(`[TeslaClient] ${res.status} ${options.method || "GET"} ${url}`)
    return res
  }

  async _ajax(url, options = {}, noRefresh = false) {
    const res = await this._fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${this.access_token}` },
    })
    if (res.ok) {
      const { response } = await res.json()
      return response
    } else if (res.status === 401 && !noRefresh) {
      await this.refreshToken()
      return this._ajax(url, options, true)
    } else {
      const msg = await res.text()
      throw new AjaxError(res.status, msg)
    }
  }

  async control(id, url, options = {}, noOnlineCheck = false) {
    const localVehicleData = this.vehicles.find((item) => item.id === id)
    if (localVehicleData?.state === "asleep") {
      await this.wakeUp(id)
    }
    try {
      const res = await this._ajax(url, options)
      return res
    } catch (err) {
      if (err.status === 408 && !noOnlineCheck) {
        await this.wakeUp(id)
        return this.control(id, url, options, true)
      }
      throw err
    }
  }

  async init() {
    this.vehicles = await this._ajax(TeslaClient.ownerApi(`/vehicles`))
  }

  async wakeUp(id) {
    const checkWakeUp = async () => {
      const wakeupRes = await this._ajax(TeslaClient.ownerApi(`/vehicles/${id}/wake_up`), {
        method: "POST",
      })
      return wakeupRes.state === "online"
    }
    await retry(checkWakeUp, "wait wake up error")
    const localVehicleData = this.vehicles.find((item) => item.id === id)
    if (localVehicleData) {
      localVehicleData.state = "online"
    }
  }

  async refreshToken() {
    const res = await this._fetch(TeslaClient.REFRESH_API, {
      method: "POST",
      body: {
        grant_type: "refresh_token",
        client_id: "ownerapi",
        refresh_token: this.refresh_token,
        scope: "openid email offline_access",
      },
    })
    if (res.ok) {
      const result = await res.json()
      this.access_token = result.access_token
      return result
    } else {
      const msg = await res.text()
      throw new AjaxError(res.status, msg)
    }
  }
}

module.exports = TeslaClient

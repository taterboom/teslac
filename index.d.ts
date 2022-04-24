type TeslaClient = any

declare function teslac(access_token: string, refresh_token: string): Promise<TeslaClient>

export default teslac

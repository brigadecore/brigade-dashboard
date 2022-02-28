import { APIClient } from "@brigadecore/brigade-sdk"

import * as config from "./Config"
import * as consts from "./Consts"

export default function getClient(): APIClient {
  const token = localStorage.getItem(consts.brigadeAPITokenKey) || ""
  return new APIClient(config.apiAddress, token)
}

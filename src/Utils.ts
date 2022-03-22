import { APIClient } from "@brigadecore/brigade-sdk"

import * as config from "./Config"
import * as consts from "./Consts"

export function getClient(): APIClient {
  const token = localStorage.getItem(consts.brigadeAPITokenKey) || ""
  return new APIClient(config.apiAddress, token)
}

export async function getUserID(): Promise<string> {
  let userID = localStorage.getItem(consts.brigadeUserIdKey)
  if (userID) {
    return userID
  }
  try {
    userID = (await getClient().authn().whoAmI()).id
    localStorage.setItem(consts.brigadeUserIdKey, userID)
    return userID
  } catch {
    // TODO: Improvement needed. Something better than empty string.
    return ""
  }
}

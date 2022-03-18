import * as consts from "./Consts"
import getClient from "./Client"

export async function getUser(): Promise<string> {
  const userIdFromLocalStorage = localStorage.getItem(consts.brigadeUserIdKey)

  if (userIdFromLocalStorage) {
    return userIdFromLocalStorage
  }

  try {
    const fetchedUserId = (await getClient().authn().whoAmI()).id
    localStorage.setItem(consts.brigadeUserIdKey, fetchedUserId)

    return fetchedUserId
  } catch {
    // TODO: Improvement needed. Something better than empty string.
    return ""
  }
}

import * as consts from "./Consts"
import getClient from "./Client"

export default async function getUser(): Promise<string> {
  const userIdFromLocalStorage: string | null = localStorage.getItem(
    consts.brigadeUserIdKey
  )

  if (userIdFromLocalStorage) {
    return userIdFromLocalStorage
  }

  try {
    const fetchedUserId = (await getClient().authn().whoAmI()).id
    localStorage.setItem(consts.brigadeUserIdKey, fetchedUserId)

    return fetchedUserId
  } catch {
    return ""
  }
}

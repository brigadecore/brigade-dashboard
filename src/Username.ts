import * as consts from "./Consts"

export default function getUserId(): string {
  return localStorage.getItem(consts.brigadeUserIdKey) || ""
}

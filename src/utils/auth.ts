import Cookies from "js-cookie";
export function isLogin(): boolean {
  if (Cookies.get("xsrf-token") !== "" && Cookies.get("xsrf-token") !== undefined) {
    return true;
  } else {
    return false;
  }
}

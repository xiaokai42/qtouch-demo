import { RootState } from "@/store/interface";
import Cookies from "js-cookie";

export const getUserInfo = (state: RootState) => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    return JSON.parse(userInfo);
  } else {
    return state.userInfo;
  }
};

export const getMenu = (state: RootState) => {
  if (Object.keys(state.menu).length !== 0) {
    return state.menu;
  }
  const menu = localStorage.getItem("menu");
  if (menu) {
    return JSON.parse(menu);
  }
  return {};
};

export const getUserName = (state: RootState) => {
  if (state.userInfo.userName !== "") {
    return state.userInfo.userName;
  }
  const userName = localStorage.getItem("userName");
  if (userName) {
    return userName;
  }
  return "";
};

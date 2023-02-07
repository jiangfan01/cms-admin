import Cookies from "js-cookie";

/***
 * 给 cookie 中的可以设置名字，用于保存 token
 * @type {string}
 */
const TokenKey = "token";

/**
 * 获取cookie中的token
 * @returns {*}
 */
export function getToken() {
  return Cookies.get(TokenKey);
}

/**
 * 设置token到cookie中
 * @param token
 * @param remember
 * @returns {*}
 */
export function setToken(token, remember = false) {
  // 若勾选了记住我，将 token 存入 cookie 中，有效期为 7 天
  if (remember) {
    return Cookies.set(TokenKey, token, { expires: 7 });
  }

  // 若没有勾选，临时存入 token 到 cookie 中
  return Cookies.set(TokenKey, token);
}

/**
 * 删除cookie中的token
 * @returns {*}
 */
export function removeToken() {
  return Cookies.remove(TokenKey);
}

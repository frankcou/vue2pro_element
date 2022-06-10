/*
 * @Author: zoufengfan
 * @Date: 2022-06-10 15:09:17
 * @LastEditTime: 2022-06-10 15:09:17
 * @LastEditors: zoufengfan
 */
module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: "plugin:vue/essential",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: ["vue"],
  rules: {},
};

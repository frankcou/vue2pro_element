<!--
 * @Author: zoufengfan
 * @Date: 2022-06-10 10:08:14
 * @LastEditTime: 2022-06-15 17:17:52
 * @LastEditors: zoufengfan
-->

# vue2pro_element

## 项目配置

- babel.config.js:
  ```js
  module.exports = {
    presets: ["@vue/babel-preset-jsx"],
  };
  ```
- main.js

  ```js
  import "element-ui/lib/theme-chalk/index.css";
  import ProTable from "vue2pro_element";
  import ElementUI from "element-ui";

  Vue.use(ElementUI, { size: "small" });
  Vue.use(ProTable);
  ```

## 项目用到 jsx, elementUI

[jsx-vue2 的使用方法](!https://github.com/vuejs/jsx-vue2)

## 组件及相关文档

- [!pro-form](./src/components/pro-form/README.md)
- [!pro-table](./src/components/pro-table/README.md)
- [!dialog-form](./src/components/dialog-form/README.md)
- [!字段配置](./src/components/ItemConfig.md)

## 所有示例

[查看](./src/App.vue)

## 项目运行/开发

```
vue run serve
```

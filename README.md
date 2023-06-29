<!--
 * @Author: zoufengfan
 * @Date: 2022-06-10 10:08:14
 * @LastEditTime: 2023-06-28 16:46:12
 * @LastEditors: zoufengfan
-->

# vue2pro_element

> 支持 jsx 的 table/form-item/table-column 封装,可通过 json 全部一次性生成。
> 项目没有进行打包，各位随便下载使用。

## 背景

1. 由于 vue2 无法通过配置控制 vnode 内容，导致自由度大大降低，特此写了个这样的基于 jsx 的框架，方便配置使用。
2. elementUI 的组件都是原子组件，无法批量应用到管理后台，所以在此基础上多做了一层封装。

## 安装与使用

```
npm install @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props vue2pro_element
```

- babel.config.js:
  ```js
  module.exports = {
    presets: ["@vue/babel-preset-jsx"],
  };
  ```
- main.js

  ```js
  import "element-ui/lib/theme-chalk/index.css";
  import ProElement from "vue2pro_element";
  import ElementUI from "element-ui";

  Vue.use(ElementUI, { size: "small" });
  Vue.use(ProElement);
  ```

## 项目使用示例

列表
https://github.com/frankcou/vue2pro_element/tree/master/src/test/list.vue

详情/新增/编辑
https://github.com/frankcou/vue2pro_element/tree/master/src/test/detail.vue

## 项目用到 jsx, elementUI

[jsx-vue2 的使用方法](https://github.com/vuejs/jsx-vue2)

## 相关组件及文档

文档地址：https://github.com/frankcou/vue2pro_element.git

- [pro-form](https://github.com/frankcou/vue2pro_element/tree/master/src/components/pro-form/README.md)
- [pro-table](https://github.com/frankcou/vue2pro_element/tree/master/src/components/pro-table/README.md)
- [dialog-form](https://github.com/frankcou/vue2pro_element/tree/master/src/components/dialog-form/README.md)
- [字段配置](https://github.com/frankcou/vue2pro_element/tree/master/src/components/ItemConfig.md)

## 项目运行/开发

```

vue run serve

```

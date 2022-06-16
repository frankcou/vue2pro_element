<!--
 * @Author: zoufengfan
 * @Date: 2022-06-10 10:08:14
 * @LastEditTime: 2022-06-16 15:24:29
 * @LastEditors: zoufengfan
-->

# vue2pro_element

> 支持 jsx 的 table/form-item/table-column 封装,可通过 json 全部一次性生成

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
  import ProTable from "vue2pro_element";
  import ElementUI from "element-ui";

  Vue.use(ElementUI, { size: "small" });
  Vue.use(ProTable);
  ```

- somecomponent.vue(基础 pro-table 演示)
  ```vue
  <template>
    <pro-table ref="protable" :columns="columns" :listPms="findPage">
    </pro-table>
  </template>
  <script>
  export default {
    columns: [{
          title: "title1",
          dataIndex: "a",
          formItemProps: { required: true },
        },
        {
          title: "title2",
          dataIndex: "b",
          valueType: "select",
          initialValue: 1,
          options: [
            { label: "options1", value: 1 },
            { label: "options2", value: 2 },
          ],
        },
        {
          title: "title1",
          dataIndex: "c",
          valueType: "img",
          initialValue:
            "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/vue/vue.png",
        },
      ],
      methods: {
        findPage() {
      return new Promise((res) => {
        setTimeout(() => {
          res({
            code: 200,
            data: {
              content: [
                {
                  a: "a value1",
                  b: 2,
                  c: "b value1",
                },
                {
                  a: "a value2",
                  b: "b value2",
                  c: "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/vue/vue.png",
                },
                {
                  a: "a value2",
                  c: "",
                },
              ],
              totalSize: 222,
            },
            msg: "msg",
          });
        }, 1000);
      });
      }
  },
  mounted(){
    this.$refs["protable"].handleSearch();
  }
  </script>
  ```

## 项目用到 jsx, elementUI

[jsx-vue2 的使用方法](https://github.com/vuejs/jsx-vue2)

## 相关组件及文档

文档地址：https://gitee.com/frankchou1/vue2pro-element/tree/master

- [pro-form](./src/components/pro-form/README.md)
- [pro-table](./src/components/pro-table/README.md)
- [dialog-form](./src/components/dialog-form/README.md)
- [字段配置](./src/components/ItemConfig.md)

## 所有示例

[查看](./src/App.vue)

## 项目运行/开发

```

vue run serve

```

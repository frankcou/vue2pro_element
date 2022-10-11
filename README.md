<!--
 * @Author: zoufengfan
 * @Date: 2022-06-10 10:08:14
 * @LastEditTime: 2022-10-11 16:06:24
 * @LastEditors: zoufengfan
-->
    

# vue2pro_element

> 支持 jsx 的 table/form-item/table-column 封装,可通过 json 全部一次性生成。

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

- somecomponent.vue(基础 pro-table 演示)
  ```vue
  <template>
    <pro-table ref="protable" :columns="columns" :listPms="findPage">
    </pro-table>
  </template>
  <script>
  export default {
    data(){
      return {
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
          hideInForm: true
        }],
      }
    },
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
                    c: "c value1",
                  },
                  {
                    a: "a value2",
                    b: "b value2",
                    c: "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/vue/vue.png",
                  },
                  {
                    a: "a value3",
                    b: "",
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

文档地址：https://github.com/frankcou/vue2pro_element.git

- [pro-form](./src/components/pro-form/README.md)
- [pro-table](./src/components/pro-table/README.md)
- [dialog-form](./src/components/dialog-form/README.md)
- [字段配置](./src/components/ItemConfig.md)

## 所有示例

[查看](./src/App.vue)

[codesandbox](https://codesandbox.io/p/github/frankcou/vue2pro_element/master?file=%2Fsrc%2FApp.vue&workspace=%257B%2522activeFileId%2522%253A%2522cl93iffjc0004lteaa2uz97bb%2522%252C%2522openFiles%2522%253A%255B%2522%252FREADME.md%2522%255D%252C%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522gitSidebarPanel%2522%253A%2522COMMIT%2522%252C%2522sidekickItems%2522%253A%255B%257B%2522type%2522%253A%2522PREVIEW%2522%252C%2522taskId%2522%253A%2522serve%2522%252C%2522port%2522%253A8080%252C%2522key%2522%253A%2522cl93x2eqg000o356h5neanoqv%2522%252C%2522isMinimized%2522%253Afalse%257D%255D%257D)

## 项目运行/开发

```

vue run serve

```

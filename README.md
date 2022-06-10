<!--
 * @Author: zoufengfan
 * @Date: 2022-06-10 10:08:14
 * @LastEditTime: 2022-06-10 18:00:25
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

## 项目运行/开发

```
vue run serve
```

## 项目用到 jsx, elementUI

jsx-vue2 的使用方法[https://github.com/vuejs/jsx-vue2]

## pro-table

### Props

| 字段名           | 描述                             | 类型                                                                                    | 默认值                                                                                                     | 可选/必填 |
| ---------------- | -------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------- |
| searchBarLoading | 异步获得 initialValue 的时候需要 | Boolean                                                                                 | false                                                                                                      | 可选      |
| listPms          | 列表请求                         | ():Promise\<any\>=>({code: number,data: {content: [{}],totalSize: number},msg: string}) | -                                                                                                          | 必填      |
| columns          | 表格/表单配置                    | Column \| Item (见下方)                                                                 | -                                                                                                          | 必填      |
| canSearch        | 是否可以查询，相当于查询钩子     | (form) => Boolean                                                                       | (form) => true                                                                                             | 可选      |
| table            | el-table 的相关配置              | Object                                                                                  | {props: {border: true,size: "medium",height: "100%",}\}                                                    | 可选      |
| pagination       | el-pagination 的相关配置         | Object                                                                                  | { props: {pageSize: 10,pageSizes: [10, 50, 100, 200],layout: "total, sizes, prev, pager, next, jumper",}\} | 可选      |

### Column/Item

**pro-table** 的 **columns** 数组单个对象配置/**json2form-item** 的 **item** 配置/**json2table-column** 的 **item** 配置

```js
{
    title: 'th的内容/formitem的label文本',//必填
    dataIndex: 'key1',//必填,字段名
    valueType: 'select',//选填,默认input(后面见valueType配置)
    initialValue: 1111,//选填,form对应字段的初始值
    fieldProps: {//选填,input,select等表单输入组件的属性,支持(form)=>FieldProps类型
      maxlength: 6,
      // on: {
      //   blur: (form, e) => {
      //     form['xxxx'] = 'ga';
      //   },
      // },
    },
    formItemProps: {},//选填,formitem属性
    transform: (e) => ({//选填,用于转换成其他字段
      startTime: e[0],
      endTime: e[1],
    }),
    scopedSlots: {//选填,input,select等表单输入组件的插槽,支持(form)=>ScopedSlots类型
      default: () => (
        <div>
          {this.options.map((item) => (
            <el-option
              key={item.value}
              label={item.label}
              value={item.value}
            ></el-option>
          ))}
        </div>
      ),
    },
    fieldRender: (form) => {//选填,表单输入组件的自定义
      return (
        <el-input vModel={form.xxxx}>
          <i
            slot="prefix"
            class="el-input__icon el-icon-search aaaaaa"
            vOn:click={this.aaa}
          ></i>
        </el-input>
      );
    },
    tableColumnProps: {},//选填,tableColumn属性
    columnRender: (h, scoped) => {//选填,column内容的自定义
      return <p>{scoped.row.xxxx}{scoped.$index}</p>;
    },
    hideInSearch: true,//选填,默认false
    hideInTable: true,//选填,默认false
  }
```

### valueType

- input(默认)
- input-number
- select
- cascader
- switch
- time-select
- date-picker
- date-time-picker
- radio
- checkbox
- transfer
- file(待完善)
- img(待完善)

<!--
 * @Author: zoufengfan
 * @Date: 2022-06-10 10:08:14
 * @LastEditTime: 2022-06-13 11:39:00
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

[jsx-vue2 的使用方法](!https://github.com/vuejs/jsx-vue2)

## pro-table

### Props

| 字段名           | 描述                                                                            | 类型                                                                                    | 默认值                                                                                                     | 可选/必填 |
| ---------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------- |
| listPms          | 列表请求                                                                        | ():Promise\<any\>=>({code: number,data: {content: [{}],totalSize: number},msg: string}) | -                                                                                                          | 必填      |
| columns          | 表格/表单配置                                                                   | Column \| Item (见下方)                                                                 | -                                                                                                          | 必填      |
| searchBarLoading | 搜索框内的 loading,searchbar 的表单初始化信号，异步获得 initialValue 的时候需要 | Boolean                                                                                 | false                                                                                                      | 可选      |
| canSearch        | 是否可以查询，相当于查询钩子                                                    | (form) => Boolean                                                                       | (form) => true                                                                                             | 可选      |
| table            | el-table 的相关配置                                                             | Object                                                                                  | {props: {border: true,size: "medium",height: "100%",}\}                                                    | 可选      |
| pagination       | el-pagination 的相关配置                                                        | Object                                                                                  | { props: {pageSize: 10,pageSizes: [10, 50, 100, 200],layout: "total, sizes, prev, pager, next, jumper",}\} | 可选      |

### Column/Item

**pro-table** 的 **columns** 数组单个对象配置/**json2form-item** 的 **item** 配置/**json2table-column** 的 **item** 配置

```jsx
{
    title: 'th的内容/formitem的label文本',//必填
    dataIndex: 'key1',//必填,字段名
    valueType: 'select',//选填,默认input(后面见valueType配置)
    editable: true,// 选填，默认true，false时仅显示字段内容
    initialValue: 1111,//选填,form对应字段的初始值
    fieldProps: {//选填,input,select等表单输入组件的属性,支持(form)=>FieldProps类型
      maxlength: 6,
      // on: {
      //   blur: (form, e) => {
      //     form['xxxx'] = 'ga';
      //   },
      // },
    },
    formItemProps: {},//选填,formitem属性,支持(form)=>FormItemProps类型
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
    //选填,select组件中el-options的配置无需自己循环,支持(form)=>Options类型
    options: [
      {label:'选项1',value:1},//非分组的写法
      {label:'分组1',options:[{label:'选项1',value:1}]},//分组的写法
      ],
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
    dataRender: ( scoped) => {//选填,tableColumn/表单（editable === false时）内容的自定义
      return <p>{scoped.row.xxxx}{scoped.$index}</p>;
    },
    hideInForm: true,//选填,默认false
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
- file(待完善,暂时没有录入功能)
- img(待完善,暂时没有录入功能)

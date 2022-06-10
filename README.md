<!--
 * @Author: zoufengfan
 * @Date: 2022-06-10 10:08:14
 * @LastEditTime: 2022-06-10 14:29:15
 * @LastEditors: zoufengfan
-->

# vue2components_zff

## 项目配置

- Then add the preset to `babel.config.js`:
  ```js
  module.exports = {
    presets: ["@vue/babel-preset-jsx"],
  };
  ```
- main.js
  ```js
  import ProTable from "vue2protable";
  Vue.use(ProTable, { ElementUI: ElementUI }); // 注册使用Element
  ```

## 项目运行/开发

```
vue run serve
```

## 项目用到 jsx, elementUI

jsx-vue2 的使用方法[https://github.com/vuejs/jsx-vue2]

## pro-table

`pro-table` 的 `columns` 配置/`json2form-item` 的 `item` 配置/`json2table-column` 的 `item` 配置

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

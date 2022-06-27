<!--
 * @Author: zoufengfan
 * @Date: 2022-06-15 16:37:32
 * @LastEditTime: 2022-06-27 11:05:15
 * @LastEditors: zoufengfan
-->

## Column/Item

**pro-table** 的 **columns** 数组单个对象配置/**json2form-item** 的 **item** 配置/**json2table-column** 的 **item** 配置

```jsx
{
    title: 'th的内容/formitem的label文本',//选填
    dataIndex: 'key1',//选填,字段名
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
    //选填,select组件中用于循环el-options以及数据(table/form)回显根据。
    // 支持funciton写法。渲染表单时形参为表单数据对象，表格时为scoped对象
    options: [
      {label:'选项1',value:1},//非分组的写法
      {label:'分组1',options:[{label:'选项1',value:1}]},//分组的写法
      ],
    formItemRender: (form) => {//选填,表单输入组件的自定义
      return (
        <el-form-item label="label文本">
          <el-input vModel={form.xxxx}>
            <i
              slot="prefix"
              class="el-input__icon el-icon-search aaaaaa"
              vOn:click={this.aaa}
            ></i>
          </el-input>
        </el-form-item>
      );
    },
    formItemProps: {},//选填,formitem属性,支持(form)=>FormItemProps类型
    rules: [],
    tableColumnProps: {},//选填,tableColumn属性
    dataRender: (scoped) => {//选填,表格/表单（只有editable === false时）内容的自定义，渲染表单内容时scoped为表单数据对象
      return <p>{scoped.row.xxxx}{scoped.$index}</p>;
    },
    hideInForm: true,//选填,默认false
    hideInTable: true,//选填,默认false
    colProps: { span: 12 } //选填，el-col的组件属性，默认{ span: 12 }
  }
```

## valueType

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

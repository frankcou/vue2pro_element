<!--
 * @Author: zoufengfan
 * @Date: 2022-06-15 16:37:32
 * @LastEditTime: 2022-07-04 16:34:08
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
    initialValue: 1111,//选填,对应字段的初始值,权重比proform的initialValues的高
    fieldProps: {//选填,input,select等表单输入组件的属性,类型FieldProps|(preLvData)=>FieldProps
      maxlength: 6,
      // on: {
      //   blur: (form, e) => {
      //     form['xxxx'] = 'ga';
      //   },
      // },
    },
    transform: (e) => ({//选填,用于转换成其他字段，retrun出来的字段将会混入preLvData中
      startTime: e[0],
      endTime: e[1],
    }),
    scopedSlots: {//选填,input,select等表单输入组件的插槽,支持(form)=>ScopedSlots类型
      default: (json2formItemContext) => (//json2formItemContext为json2formItem组件的this，提供单独校验方法validate
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
    //选填,select组件中用于循环el-options以及数据(table/form)回显根据，无匹配则直接显示数据。
    //类型ElOptionProps[]|(preLvData)=>ElOptionProps[]
    options: [
      {label:'选项1',value:1},//非分组的写法
      {label:'分组1',options:[{label:'选项1',value:1}]},//分组的写法
      ],
    formItemRender: (preLvData) => {//选填,表单输入组件的自定义；类型(preLvData,model,prop)=>Dom，当此item为group子集时，可根据prop找index值
      return (
        <el-form-item label="label文本">
          <el-input vModel={preLvData.xxxx}>
            <i slot="prefix" vOn:click={this.aaa}></i>
          </el-input>
        </el-form-item>
      );
    },
    formItemProps: {},//选填,属性同elementui文档一致,类型FormItemProps|(parentData)=>FormItemProps
    rules: [],//校验用的规则，类型同elementui文档一致
    tableColumnProps: {},//选填,tableColumn属性,类型同elementui文档一致
    dataRender: (scoped) => {
      return <p>{scoped.row.xxxx}{scoped.$index}</p>;
    },//选填,表格/表单（只有editable === false时）内容的自定义，表格类型({row,$index})=>Dom，表单类型(preLvData)=>Dom
    hideInForm: true,//选填,是否显示该字段在详情/表单上，默认false,类型Boolean|(parentData)=>Boolean
    hideInTable: true,//选填,是否显示该字段在表格中，默认false
    colProps: { span: 12 } //选填，el-col的组件属性，默认{ span: 12 }
    groupColumns: undefined ,//valueType为group时必填，类型Item[]|({ row, index })=>Item[]
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
- group(表单数据为数组嵌套对象时可使用)

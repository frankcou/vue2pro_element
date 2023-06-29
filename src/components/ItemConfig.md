<!--
 * @Author: zoufengfan
 * @Date: 2022-06-15 16:37:32
 * @LastEditTime: 2023-06-29 13:29:55
 * @LastEditors: zoufengfan
-->

## Column

**pro-table** 的 **columns** 数组单个对象配置/**json2form-item** 的 **item** 配置/**json2table-column** 的 **item** 配置

```tsx
type Column = {
    dataIndex: 'key1',//字段名
    title?: string | (...p:Props)=>string,// 字段描述（th的内容/formitem的label文本）
    valueType?: string | (...p:Props)=>string ,//默认input(后面见valueType配置)
    groupColumns?: Column[] ,//valueType为group时必填
    editable?: boolean,// 默认true，false时仅显示字段内容
    initialValue?: any,//对应字段的初始值,权重比proform的initialValues的高
    /**
     * input,select等表单输入组件的属性,如：
      (pre)=>({
        maxlength: 6,
        on: {
          blur: (e) => {
            pre.aaa = e
          },
        },
      })
     */
    fieldProps?: FieldProps| (...p:Props)=>FieldProps,
    /**
     * select组件中用于循环el-options以及数据(table/form)回显根据，无匹配则直接显示数据。
     * 例如 [
      {label:'选项1',value:1},//非分组的写法
      {label:'分组1',options:[{label:'选项1',value:1}]},//分组的写法
      ],
     */
    options?:Option[]| (...p:Props)=>Option[],
    formItemProps?:FormItemProps| (...p:Props)=>FormItemProps,//el-form-item属性，同elementui文档一致
    rules?: Rule[]| (...p:Props)=>Rule[],//校验用的规则，类型同elementui文档一致
    tableColumnProps?: object,//el-table-column属性,类型同elementui文档一致
    hideInDesc?: boolean | (...p:Props)=>boolean,//是否显示该字段在详情上，默认false,
    hideInForm?: boolean | (...p:Props)=>boolean,//是否显示该字段在表单上，默认false,
    hideInTable?: boolean | (...p:Props)=>boolean,//是否显示该字段在表格中，默认false
    colProps?: object| (...p:Props)=>object //el-col的组件属性，默认{ span: 12 }
    transform?: (e:any) => object//用于把当前dataIndex对应值转换成其他字段，retrun出来的字段将会混入preLvData中
    /**
     * input,select等表单输入组件的插槽(fieldProps.scopedSlots权重更高)
     * 例如：
     * {
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
     */
    scopedSlots?: object| (...p:Props)=>object,
   /**
    * 表单输入组件的自定义；类型(preLvData,model,prop)=>Dom，当此item为group子集时，可根据prop找index值
    */
    formItemRender?: (...p:Props) => VNode,
    /**
     * 表格/表单（只有editable === false时）内容的自定义
     */
    dataRender?: (...p:Props) => VNode,
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

## Props

来自 json2form-item 的属性。

参数依次为：

1. this.preLvData,// 该属性（dataIndex）的上一级数据（表格中 preLvData 为{row,column,$index}）
2. this.elForm.model, //根数据（表单数据）
3. this.prop,// 表单时，赋值给 form-item 上的 prop。格式为 prop 或者 prop.2.prop。表格相似。
4. this.rowIndex,// 行排序
5. this.elForm,// 表单实例

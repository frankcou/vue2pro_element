<!--
 * @Author: zoufengfan
 * @Date: 2022-06-15 16:31:41
 * @LastEditTime: 2023-06-29 10:01:10
 * @LastEditors: zoufengfan
-->

# DialogForm

## Props

| 字段名       | 描述                                                                                                | 类型                               | 默认值                    | 可选/必填                          |
| ------------ | --------------------------------------------------------------------------------------------------- | ---------------------------------- | ------------------------- | ---------------------------------- |
| type         | 弹层类型(新增/编辑/详情)                                                                            | `'add' \|'edit' \|'detail'`        | -                         | 必填                               |
| value        | 是否显示                                                                                            | Boolean                            | -                         | 必填                               |
| columns      | form 字段配置                                                                                       | [Column \| Item](../ItemConfig.md) | -                         | 必填                               |
| title        | 标题                                                                                                | String                             | -                         | 可选                               |
| dialogProps  | [el-dialog 的配置](https://element.eleme.cn/#/zh-CN/component/dialog),events 放在 dialogProps.on 中 | Object                             | -                         | 可选                               |
| formProps    | [pro-form 的配置](../pro-form/README.md),events 放在 formProps.on 中                                | Object                             | -                         | 可选                               |
| closeText    | 取消按钮的文字描述                                                                                  | String                             | '取 消'                   | 可选                               |
| okText       | 提交按钮的文字描述                                                                                  | String                             | 提 交                     | 可选                               |
| request      | 初始化数据的 Promise 请求                                                                           | `()=>Promise<Model>`               | `() => ({})`              | 可选（**type**为`'detail'`时必填） |
| afterRequest | request 请求之后出发                                                                                | Function                           | `() => {}`                | 可选                               |
| okConfirm    | 点击提交的逻辑，返回 true 继续提交逻辑                                                              | ()=>Boolean                        | 默认使用$confirm 进行询问 | 可选                               |

## Methods

| 字段名       | 描述                   | 默认参数                | 类型              |
| ------------ | ---------------------- | ----------------------- | ----------------- |
| reset        | 重置的方法             | -                       | ()=>{}            |
| handleClose  | 包含提示关闭的关闭方法 | -                       | ()=>{}            |
| handleSubmit | 提交的方法             | `this.$refs["proform"]` | (slotFormRef)=>{} |

## Slots

| 名称       | 描述          |
| ---------- | ------------- |
| formTop    | pro-form 上方 |
| default    | pro-form 实例 |
| formBottom | pro-form 下方 |
| footer     | 按钮部分      |

## Refs

| 字段名  | 描述          |
| ------- | ------------- |
| proform | pro-form 实例 |

<!--
 * @Author: zoufengfan
 * @Date: 2022-06-15 16:31:41
 * @LastEditTime: 2022-06-15 17:24:53
 * @LastEditors: zoufengfan
-->

# DialogForm

## Props

| 字段名      | 描述                                                                  | 类型                               | 默认值           | 可选/必填 |
| ----------- | --------------------------------------------------------------------- | ---------------------------------- | ---------------- | --------- |
| value       | 是否显示                                                              | Boolean                            | -                | 必填      |
| columns     | form 字段配置                                                         | [Column \| Item](../ItemConfig.md) | -                | 必填      |
| title       | 标题                                                                  | String                             | -                | 可选      |
| dialogProps | [el-dialog 的配置](https://element.eleme.cn/#/zh-CN/component/dialog) | Object                             | -                | 可选      |
| formProps   | [pro-form 的配置](../pro-form/README.md)                              | Object                             | -                | 可选      |
| closeText   | 取消按钮的文字描述                                                    | String                             | '取 消'          | 可选      |
| okText      | 提交按钮的文字描述                                                    | String                             | 提 交            | 可选      |
| onFinish    | 提交时所需的 Promise 请求                                             | (params)=>Promise<boolean>         | (params) => true | 可选      |

## Methods#

| 字段名       | 描述       | 参数 |
| ------------ | ---------- | ---- |
| handleClose  | 关闭的方法 | —    |
| handleSubmit | 提交的方法 | —    |

<!--
 * @Author: zoufengfan
 * @Date: 2022-06-15 16:31:21
 * @LastEditTime: 2022-07-04 16:55:23
 * @LastEditors: zoufengfan
-->

# ProForm

## Props

| 字段名        | 描述                                  | 类型                               | 默认值 | 可选/必填 |
| ------------- | ------------------------------------- | ---------------------------------- | ------ | --------- |
| columns       | 表单字段配置,会进行监听               | [Column \| Item](../ItemConfig.md) | -      | 必填      |
| loading       | 初始化表单的信号（false 的时候）      | Boolean                            | false  | 可选      |
| editable      | true 时显示表单，false 时显示字段内容 | Boolean                            | true   | 可选      |
| initialValues | 表单初始值                            | Object                             | -      | 可选      |

其余 Props,Methods,Events 与[el-form](https://element.eleme.cn/#/zh-CN/component/form)的一致

## Refs

| 字段名 | 描述         |
| ------ | ------------ |
| form   | el-form 实例 |

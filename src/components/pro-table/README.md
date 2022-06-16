<!--
 * @Author: zoufengfan
 * @Date: 2022-06-15 16:31:15
 * @LastEditTime: 2022-06-16 10:39:57
 * @LastEditors: zoufengfan
-->

# ProTable

## 使用示例

> 第一次列表查询需要手动触发
> `this.$refs["protable"].handleSearch();`

## Props

| 字段名           | 描述                                                                              | 类型                                                                                    | 默认值                                                                                                | 可选/必填 |
| ---------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | --------- |
| listPms          | 列表请求                                                                          | ():Promise\<any\>=>({code: number,data: {content: [{}],totalSize: number},msg: string}) | -                                                                                                     | 必填      |
| columns          | 表格/表单配置                                                                     | [Column \| Item](../ItemConfig.md)                                                      | -                                                                                                     | 必填      |
| searchBarLoading | 搜索框内的 loading,searchbar 的表单初始化信号，异步获得 initialValue 的时候需要   | Boolean                                                                                 | false                                                                                                 | 可选      |
| height           | 整个 protable 的高度                                                              | String                                                                                  | -                                                                                                     | 可选      |
| canSearch        | 是否可以查询，相当于查询钩子                                                      | (form) => Boolean                                                                       | (form) => true                                                                                        | 可选      |
| tableProps       | [el-table 的相关配置](https://element.eleme.cn/#/zh-CN/component/table)           | Object                                                                                  | {border: true,size: "medium",height: "100%",on:{}\}                                                   | 可选      |
| paginationProps  | [el-pagination 的相关配置](https://element.eleme.cn/#/zh-CN/component/pagination) | Object                                                                                  | {pageSize: 10,pageSizes: [10, 50, 100, 200],layout: "total, sizes, prev, pager, next, jumper",on:{}\} | 可选      |

## Methods

| 字段名       | 描述       | 参数 |
| ------------ | ---------- | ---- |
| handleSearch | 搜索的方法 | —    |
| handleClear  | 重置的方法 | —    |

## Refs

| 字段名     | 描述                 |
| ---------- | -------------------- |
| search-bar | 组件 search-bar 实例 |
| table      | el-table 实例        |
| pagination | el-pagination 实例   |

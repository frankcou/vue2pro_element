<!--
 * @Author: zoufengfan
 * @Date: 2022-06-15 16:31:21
 * @LastEditTime: 2023-06-29 10:28:44
 * @LastEditors: zoufengfan
-->

# ProForm

## Props

| 字段名        | 描述                                  | 类型                               | 默认值 | 可选/必填 |
| ------------- | ------------------------------------- | ---------------------------------- | ------ | --------- |
| columns       | 表单字段配置,会进行监听               | [Column \| Item](../ItemConfig.md) | -      | 必填      |
| loading       | 初始化表单的信号（false 的时候）      | Boolean                            | false  | 可选      |
| shouldLoading | 要不要 loading 动效                   | Boolean                            | true   | 可选      |
| editable      | true 时显示表单，false 时显示字段内容 | Boolean                            | true   | 可选      |
| initialValues | 表单初始值                            | Object                             | -      | 可选      |

其余 Props,Methods,Events 与[el-form](https://element.eleme.cn/#/zh-CN/component/form)的一致

## Slots

| 名称   | 描述          |
| ------ | ------------- |
| before | pro-form 上方 |
| after  | pro-form 下方 |

## Refs

| 字段名 | 描述         |
| ------ | ------------ |
| form   | el-form 实例 |

## 其他

- 若想表单好看整齐一些，又不打算考虑 flex 兼容问题的话可以改写 el-form-item 样式：

  ```scss
  .some_component {
    .el-form-item {
      display: flex;
      .el-form-item__content {
        flex: 1;
        width: 100%;
      }
    }
  }
  ```

- 对于`inline===false`的表单，是否显示对应字段的条件为`!item.hideInForm && (item.editable || item.title)`
-

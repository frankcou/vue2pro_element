<!--
 * @Author: zoufengfan
 * @Date: 2022-06-13 12:11:00
 * @LastEditTime: 2023-02-28 13:45:10
 * @LastEditors: zoufengfan
-->
<template>
  <el-form
    class="pro-form"
    ref="form"
    @submit.native.prevent
    v-loading="loading"
    v-bind="$attrs"
    v-on="$listeners"
    :model="model"
    :inline="isInline"
    :label-suffix="editable ? '' : ':'"
    :hide-required-asterisk="!editable"
  >
    <slot name="before"></slot>
    <template v-if="!isInline">
      <json2form-item
        v-for="item in columns"
        :key="item.dataIndex"
        v-model="model"
        :item="{ ...item, editable: isEditable(item) }"
      ></json2form-item>
    </template>
    <template v-else>
      <el-row align="top" :gutter="10" style="margin-left: 0; margin-right: 0">
        <el-col
          v-for="item in columns"
          :key="item.dataIndex"
          v-bind="item.colProps || { span: 12 }"
          v-show="!getObj(item.hideInForm) && (isEditable(item) || item.title)"
        >
          <!-- :contentWidth="
              $attrs['label-width']
                ? 'calc(100% - ' + $attrs['label-width'] + ')'
                : ''
            " -->
          <!-- :class="setFitClass" -->

          <json2form-item
            v-model="model"
            :item="{ ...item, editable: isEditable(item) }"
          ></json2form-item>
        </el-col>
      </el-row>
    </template>
    <slot name="after"></slot>
  </el-form>
</template>

<script>
const defVal = '';
export default {
  name: 'pro-form',
  props: {
    loading: {
      default: false,
      type: Boolean,
    },
    columns: {
      type: Array,
      required: true,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    initialValues: Object,
  },
  data() {
    return {
      isMounted: false,
      model: {},
    };
  },
  computed: {
    // 用于同时监听两个参数
    columnsAndloading() {
      return [this.columns, this.loading];
    },
    isInline() {
      if (this.$attrs.inline === undefined) return true;
      return this.$attrs.inline;
    },
    // setFitClass() {
    //   return this.$attrs["label-width"] ? "fitform-item" : "";
    // },
  },
  methods: {
    isEditable(item) {
      return item.editable || this.editable;
    },
    getObj(obj, ...args) {
      if (obj && obj.constructor === Function) return obj(this.model, ...args);
      return obj;
    },
    validate(fn) {
      this.$refs['form'].validate(fn);
    },
    validateField(...args) {
      this.$refs['form'].validateField(...args);
    },
    /**重置：表单第一次初始化的参数 */
    resetFields() {
      this.$refs['form'].resetFields();
    },
    /**清空表单 */
    clearFields() {
      let model = {};

      for (const key in this.model) {
        if (Object.hasOwnProperty.call(this.model, key)) {
          model[key] = defVal;
        }
      }
      this.$set(this, 'model', model);
      this.clearValidate();
    },
    clearValidate(fn) {
      this.$refs['form'].clearValidate(fn);
    },
  },
  watch: {
    columnsAndloading: {
      immediate: true,
      deep: true,
      handler(newVal, oldval) {
        if (!newVal) return;
        let [columns, loading] = newVal;
        if (loading || !columns) return;
        let model = {};

        // 第一次改变数据————初始化数据
        if (!loading && columns.length && !this.isMounted) {
          console.log('form init', columns);
          console.log('initval', this.initialValues);
          this.isMounted = true;
          columns.forEach((item, idx) => {
            if (item.dataIndex) {
              model[item.dataIndex] =
                item.initialValue !== undefined
                  ? item.initialValue
                  : this.initialValues[item.dataIndex] !== undefined
                  ? this.initialValues[item.dataIndex]
                  : defVal;

              if (typeof item.transform === 'function') {
                let object = item.transform(model[item.dataIndex]);
                Object.assign(model, object || {});
              }
            }
          });
          this.$set(this, 'model', model);
          console.log('model', model);
          // columns更新,获取最新字段
        } else if (!loading && columns.length && this.isMounted) {
          console.log('update columns', columns);
          columns.forEach((item) => {
            if (item.dataIndex) {
              model[item.dataIndex] = this.model[item.dataIndex];
            }
          });
          this.$set(this, 'model', model);
          console.log('model', model);
        }
        // 这里的赋值需要用到$set，因为组件初始化的时候form没有二级对象，没有进行双向绑定
      },
    },
  },
};
</script>

<style scoped>
/* 显示详情的时候 */
::v-deep [class*='el-col-'] {
  display: inline-block;
  vertical-align: top;
  float: none;
}
</style>

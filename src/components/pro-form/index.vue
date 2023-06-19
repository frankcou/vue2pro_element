<!--
 * @Author: zoufengfan
 * @Date: 2022-06-13 12:11:00
 * @LastEditTime: 2023-03-08 17:21:03
 * @LastEditors: zoufengfan
-->
<template>
  <div v-loading="shouldLoading ? loading : false" v-if="!isCreated"></div>
  <el-form
    v-else
    class="pro-form"
    ref="form"
    @submit.native.prevent
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
        :key="`${item.dataIndex} ${item.title}`"
        v-model="model"
        :item="{ ...item, editable: isEditable(item) }"
      ></json2form-item>
    </template>
    <template v-else>
      <el-row align="top" :gutter="10" style="margin-left: 0; margin-right: 0">
        <json2form-item
          v-for="item in columns"
          :key="`${item.dataIndex} ${item.title}`"
          v-model="model"
          :item="{ ...item, editable: isEditable(item) }"
          inline
        ></json2form-item>
        <!-- </el-col> -->
      </el-row>
    </template>
    <slot name="after"></slot>
  </el-form>
</template>

<script>
import { objByPath } from '../../utils';
// const defVal = '';
export default {
  name: 'pro-form',
  props: {
    /** 要不要loading动效 */
    shouldLoading: {
      default: true,
      type: Boolean,
    },
    /**用于监听何时columns的数据完整 */
    loading: {
      default: false,
      type: Boolean,
    },
    /**字段配置 */
    columns: {
      type: Array,
      required: true,
    },
    /**是否可编辑 */
    editable: {
      type: Boolean,
      default: true,
    },
    /**初始值 */
    initialValues: Object,
  },
  data() {
    return {
      /** 表示表单初始数据是否完成赋值 */
      isCreated: false,
      /** 表单值 */
      model: {},
      /** 清空后的值 */
      emptyData: {},
    };
  },
  computed: {
    // 用于同时监听两个参数
    columnsAndloading() {
      return { columns: this.columns, loading: this.loading };
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
      // let model = {};

      // for (const key in this.model) {
      //   if (Object.hasOwnProperty.call(this.model, key)) {
      //     model[key] = this.defVal();
      //   }
      // }
      // this.$set(this, 'model', model);
      this.$set(this, 'model', this.emptyData);

      this.clearValidate();
    },
    clearValidate(fn) {
      this.$refs['form'].clearValidate(fn);
    },
    defVal(item) {
      return item.valueType === 'group' ? [] : '';
    },
  },
  watch: {
    columnsAndloading: {
      immediate: true,
      deep: true,
      handler(newVal, oldval) {
        if (!newVal) return;
        let { columns, loading } = newVal;
        if (loading || !columns) return;
        let model = {};
        let emptyData = {};

        // 第一次改变数据————初始化数据
        if (!loading && columns.length && !this.isCreated) {
          console.log('form init', columns);
          console.log('initval', this.initialValues);
          this.isCreated = true;
          columns.forEach((item, idx) => {
            if (item.dataIndex) {
              const val = objByPath(this.initialValues, item.dataIndex).get();
              objByPath(model, item.dataIndex).set(
                item.initialValue !== undefined
                  ? item.initialValue
                  : ![undefined, null].includes(this.initialValues && val)
                  ? val
                  : this.defVal(item),
              );

              objByPath(emptyData, item.dataIndex).set(this.defVal(item));

              if (typeof item.transform === 'function') {
                let object = item.transform(
                  objByPath(model, item.dataIndex).get(),
                );
                Object.assign(model, object || {});

                let object_empty = item.transform(
                  objByPath(emptyData, item.dataIndex).get(),
                );
                objByPath(emptyData, item.dataIndex).set(this.defVal(item));
                Object.assign(emptyData, object_empty || {});
              }
            }
          });
          this.$set(this, 'emptyData', emptyData);
          Object.freeze(this.emptyData);

          this.$set(this, 'model', model);
          console.log('model', model);
          // columns更新,获取最新字段
        } else if (!loading && columns.length && this.isCreated) {
          console.log('update columns', columns);
          columns.forEach((item) => {
            if (item.dataIndex) {
              objByPath(model, item.dataIndex).set(
                objByPath(this.model, item.dataIndex).get(),
              );
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

<style scoped></style>

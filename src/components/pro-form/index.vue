<!--
 * @Author: zoufengfan
 * @Date: 2022-06-13 12:11:00
 * @LastEditTime: 2022-06-30 12:04:11
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
  </el-form>
</template>

<script>
export default {
  name: "pro-form",
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
      model: {},
    };
  },
  computed: {
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
      if (!obj) return obj;
      if (obj.constructor === Object || obj.constructor === Array) return obj;
      if (obj.constructor === Function) return obj(this.model, ...args);
    },
    validate(fn) {
      this.$refs["form"].validate(fn);
    },
    validateField(fn) {
      this.$refs["form"].validateField(fn);
    },
    resetFields() {
      this.$refs["form"].resetFields();
    },
    clearValidate(fn) {
      this.$refs["form"].clearValidate(fn);
    },
  },
  watch: {
    loading: {
      immediate: true,
      handler(val, oldval) {
        if (!val) {
          console.log("init pro-form");
          // init
          Object.assign(this.$data, this.$options.data(this));

          this.columns.forEach((item) => {
            if (item.dataIndex) {
              // 这里的赋值需要用到$set，因为组件初始化的时候form没有二级对象，没有进行双向绑定
              this.$set(
                this.model,
                item.dataIndex,
                item.initialValue ||
                  (this.initialValues
                    ? this.initialValues[item.dataIndex]
                    : undefined)
              );
            }
          });
          if (this.initialValues) {
            this.model = {
              ...this.initialValues,
              ...this.model,
            };
          }
        }
      },
    },
  },
};
</script>

<style scoped>
::v-deep [class*="el-col-"] {
  display: inline-block;
  vertical-align: top;
  float: none;
}
</style>
<!-- <style>
.el-form--inline .fitform-item {
  display: block;
}
</style> -->

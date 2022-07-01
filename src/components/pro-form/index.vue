<!--
 * @Author: zoufengfan
 * @Date: 2022-06-13 12:11:00
 * @LastEditTime: 2022-07-01 16:05:03
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
      if (obj && obj.constructor === Function) return obj(this.model, ...args);
      return obj;
    },
    validate(fn) {
      this.$refs["form"].validate(fn);
    },
    validateField(fn) {
      this.$refs["form"].validateField(fn);
    },
    resetFields() {
      this.$refs["form"].resetFields();
      // 处理transform参数
      this.columns.forEach((item) => {
        if (typeof item.transform === "function") {
          let object = item.transform(null);
          for (const key in object) {
            if (Object.hasOwnProperty.call(object, key)) {
              const value = object[key];
              this.$set(this.model, key, value);
            }
          }
        }
      });
    },
    clearValidate(fn) {
      this.$refs["form"].clearValidate(fn);
    },
  },
  watch: {
    columns: {
      deep: true,
      handler(val) {
        this.$nextTick(() => {
          let model = {};
          this.columns.forEach((item) => {
            if (item.dataIndex) {
              model[item.dataIndex] = this.model[item.dataIndex];
            }
          });
          this.$set(this, "model", model);
        });
      },
    },
    loading: {
      immediate: true,
      handler(val, oldval) {
        if (!val) {
          this.$nextTick(() => {
            console.log("pro-form init ");
            // init
            let model = {};
            this.columns.forEach((item) => {
              if (item.dataIndex) {
                console.log(1);
                model[item.dataIndex] =
                  item.initialValue ||
                  (this.initialValues
                    ? this.initialValues[item.dataIndex]
                    : undefined);
              }
            });
            if (this.initialValues) {
              model = {
                ...this.initialValues,
                ...model,
              };
            }
            // 这里的赋值需要用到$set，因为组件初始化的时候form没有二级对象，没有进行双向绑定
            this.$set(this, "model", model);
          });
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

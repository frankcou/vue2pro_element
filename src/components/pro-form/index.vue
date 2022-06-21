<!--
 * @Author: zoufengfan
 * @Date: 2022-06-13 12:11:00
 * @LastEditTime: 2022-06-21 13:36:18
 * @LastEditors: zoufengfan
-->
<template>
  <el-form
    class="pro-form"
    ref="form"
    v-loading="loading"
    v-bind="$attrs"
    v-on="$listeners"
    :model="model"
    :inline="isInline"
  >
    <template v-if="!isInline">
      <json2form-item
        v-for="item in columns"
        :key="item.dataIndex"
        :model="model"
        :item="{ ...item, editable: item.editable || editable }"
      ></json2form-item>
    </template>
    <template v-else>
      <el-row
        type="flex"
        align="top"
        :gutter="10"
        style="margin-left: 0; margin-right: 0"
      >
        <el-col
          v-for="item in columns"
          :key="item.dataIndex"
          v-bind="item.colProps || { span: 12 }"
        >
          <json2form-item
            :model="model"
            :item="{ ...item, editable: item.editable || editable }"
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
  },
  methods: {
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
          //   console.log("init pro-form");
          // init
          this.columns.forEach((item) => {
            if (!item.hideInForm) {
              // 这里的赋值需要用到$set，因为组件初始化的时候form没有二级对象，没有进行双向绑定
              this.$set(
                this.model,
                item.dataIndex,
                item.initialValue || undefined
              );
            }
          });
        }
      },
    },
  },
};
</script>

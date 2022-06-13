<!--
 * @Author: zoufengfan
 * @Date: 2022-06-13 12:11:00
 * @LastEditTime: 2022-06-13 14:09:11
 * @LastEditors: zoufengfan
-->
<template>
  <el-form ref="form" :model="model" v-loading="loading">
    <json2form-item
      v-for="item in columns"
      :key="item.dataIndex"
      :model="model"
      :item="{ ...item, editable: item.editable || editable }"
    ></json2form-item>
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
  watch: {
    loading: {
      immediate: true,
      handler(val, oldval) {
        if (!val) {
          console.log("init pro-form");
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
<style lang="scss" scoped></style>

<!--
 * @Author: zoufengfan
 * @Date: 2022-02-22 17:10:39
 * @LastEditTime: 2022-06-16 14:21:08
 * @LastEditors: zoufengfan
-->
<template>
  <div class="search-bar" v-loading="loading">
    <el-form ref="form" :model="model" inline v-if="!loading">
      <!-- <div class="fr">
        <slot name="R">
          <el-button type="primary" @click="handleSearch()">查 询</el-button>
          <el-button @click="handleClear">清空搜索条件</el-button>
        </slot>
      </div> -->
      <slot></slot>
      <div class="search-btns">
        <slot name="R">
          <el-button type="primary" size="small" @click="handleSearch()"
            >查 询</el-button
          >
          <el-button size="small" @click="handleClear">重置</el-button>
        </slot>
      </div>
      <div class="search-bar-bottom">
        <slot name="B"></slot>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "search-bar",
  props: {
    loading: Boolean,
    model: {
      required: true,
      type: Object,
    },
    handleSearch: {
      // required: true,
      type: Function,
    },
    handleClear: {
      // required: true,
      type: Function,
    },
  },
  methods: {},
};
</script>

<style scoped>
.search-bar {
  padding: 10px 15px;
}
::v-deep .el-form-item {
  margin-bottom: 10px;
}
.search-btns {
  display: inline-block;
  margin-bottom: 10px;
  line-height: 32px;
}
</style>

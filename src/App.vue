<!--
 * @Author: zoufengfan
 * @Date: 2022-06-10 10:07:51
 * @LastEditTime: 2022-06-10 17:14:42
 * @LastEditors: zoufengfan
-->
<template>
  <div id="app">
    <pro-table ref="protable" :columns="columns" :listPms="findPage">
    </pro-table>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      columns: [
        { title: "title1", dataIndex: "a" },
        { title: "title2", dataIndex: "b", typeValue: "select" },
      ],
    };
  },
  methods: {
    findPage() {
      return new Promise((res) => {
        setTimeout(() => {
          res({
            code: 200,
            data: {
              content: [
                {
                  a: "a value1",
                  b: "b value1",
                },
                {
                  a: "a value2",
                  b: "b value2",
                },
              ],
              totalSize: 222,
            },
            msg: "msg",
          });
        }, 1000);
      });
    },
  },
  mounted() {
    this.$refs["protable"].handleSearch();
  },
};
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
}
</style>

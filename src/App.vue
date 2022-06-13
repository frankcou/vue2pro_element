<!--
 * @Author: zoufengfan
 * @Date: 2022-06-10 10:07:51
 * @LastEditTime: 2022-06-13 14:22:22
 * @LastEditors: zoufengfan
-->
<template>
  <div id="app">
    <h3>table</h3>
    <pro-table
      style="height: 600px"
      ref="protable"
      :columns="columns"
      :listPms="findPage"
    >
    </pro-table>
    <h3>form表单</h3>
    <!-- :editable="false" -->
    <pro-form :columns="columns" :editable="false"></pro-form>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      columns: [
        { title: "title1", dataIndex: "a", formItemProps: { required: true } },
        {
          title: "title2",
          dataIndex: "b",
          valueType: "select",
          initialValue: 1,
          options: [{ label: "options1", value: 1 }],
        },
        {
          title: "title1",
          dataIndex: "c",
          valueType: "file",
          initialValue:
            "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/vue/vue.png",
        },
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

<!--
 * @Author: zoufengfan
 * @Date: 2022-06-01 17:38:41
 * @LastEditTime: 2022-06-10 10:23:16
 * @LastEditors: zoufengfan
-->

<script>
export default {
  name: "json2table-column",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    form: {
      get() {
        return this.model;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  render(h) {
    let item = this.item;
    return (
      <el-table-column
        label={item.title}
        key={item.dataIndex}
        header-align="center"
        align="center"
        props={item.tableColumnProps}
        attrs={item.tableColumnProps}
        scopedSlots={{
          default: (scope) =>
            item.columnRender
              ? item.columnRender(h, scope)
              : scope.row[item.dataIndex],
        }}
      ></el-table-column>
    );
  },
};
</script>

<style></style>

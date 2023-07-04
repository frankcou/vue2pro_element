<script>
export default {
  name: 'DataTable',
  props: {
    title: {
      type: String,
    },
    dataSource: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return { curr: 1, pageSize: 5 };
  },
  computed: {
    dataSourceInVisible() {
      if (!this.dataSource) return [];
      return this.dataSource.filter(
        (_, idx) =>
          idx < this.curr * this.pageSize &&
          idx >= (this.curr - 1) * this.pageSize,
      );
    },
  },
  methods: {
    handlePageCurrChange(e) {
      this.curr = e;
    },
    handleSizeChange(e) {
      this.pageSize = e;
    },
  },
  render(h) {
    return (
      <div>
        <el-form-item
          label={this.title}
          required={false}
          style={{ margin: 0 }}
        ></el-form-item>
        <el-table data={this.dataSourceInVisible}>
          <el-table-column type="index"></el-table-column>
          {this.$scopedSlots.default()}
        </el-table>
        <div class="data_table-pagination_wrap">
          <el-pagination
            class="data_table-pagination"
            // hide-on-single-page={true}
            pageSize={this.pageSize}
            pageSizes={[5, 10, 20, 50]}
            layout="total, sizes, prev, pager, next, jumper"
            total={this.dataSource.length || 0}
            on={{
              'current-change': this.handlePageCurrChange,
              'size-change': this.handleSizeChange,
            }}
          ></el-pagination>
        </div>
      </div>
    );
  },
};
</script>

<style scoped>
.data_table-pagination_wrap {
  text-align: center;
}
.data_table-pagination {
  display: inline-block;
}
</style>

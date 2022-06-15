<!--
 * @Author: zoufengfan
 * @Date: 2022-06-01 15:11:47
 * @LastEditTime: 2022-06-15 16:41:06
 * @LastEditors: zoufengfan
-->

<script>
import SearchBar from "../search-bar/index.vue";
import Json2FormItem from "../json2form-item";
import Json2TableColumn from "../json2table-column";

export default {
  name: "ProTable",
  components: {
    SearchBar,
  },
  props: {
    height: {
      type: String,
    },
    //   搜索框内的loading,searchbar的表单初始化信号
    searchBarLoading: {
      type: Boolean,
      default: false,
    },
    //
    /**
     * 列表请求,返回Promise的function，返回格式为
     {
        code: 200,
        data: {
            content: [{}],
            totalSize: 222,
        },
        msg: 'msg'
      }
     */
    listPms: {
      type: Function,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    // 用于修改请求参数，需return出来
    transformParams: {
      type: Function,
    },
    canSearch: {
      type: Function,
      default: (form) => true,
    },
    // ========= el-table组件相关,与文档一样 ==========
    table: {
      type: Object,
      required: false,
      default: () => ({
        props: {
          border: true,
          size: "medium",
        },
      }),
    },
    // ========= el-pagination组件相关,与文档一样 ==========
    pagination: {
      type: Object,
      required: false,
      default: () => ({
        props: {
          pageSize: 10,
          pageSizes: [10, 50, 100, 200],
          layout: "total, sizes, prev, pager, next, jumper",
        },
      }),
    },
  },
  data() {
    return {
      tableLoading: false,
      //   form字段配置
      form: {},
      currentPage: 1,
      paginationAttr: {},
      // 列表数据
      pageResult: {
        content: [],
        totalSize: 0,
      },
    };
  },
  computed: {
    // 搜索参数
    searchParams() {
      let params = {
        params: this.form,
        pageNum: this.currentPage,
        pageSize: this.paginationAttr.pageSize,
      };
      return this.transformParams ? this.transformParams(params) : params;
    },
    // table字段配置
    tableColumns() {
      return this.columns.filter((item) => !item.hideInTable);
    },
  },
  methods: {
    //   点击搜索框
    handleSearch() {
      if (!this.canSearch(this.form)) return;
      this.findPage();
      this.$emit("search");
    },
    //   点击重置表单
    handleClear() {
      this.$emit("reset");
      this.$refs["search-bar"].$refs["form"].resetFields();
    },
    // 获取分页数据
    findPage() {
      this.tableLoading = true;
      return new Promise((res, rej) => {
        // nextTick为了防止没有获取最新的searchParams
        this.$nextTick(() => {
          this.listPms(this.searchParams)
            .then((_res) => {
              res(_res);
              if (_res.code === 200) {
                this.pageResult = _res.data;
              } else {
                rej(_res);
                this.$message({
                  type: "error",
                  message: _res.msg,
                });
              }
            })
            .catch((e) => {
              rej(e);
              this.$message({
                type: "error",
                message: e.msg || e.message,
              });
            })
            .finally(() => {
              this.tableLoading = false;
            });
        });
      });
    },
    handleSizeChange(val) {
      this.paginationAttr.pageSize = val;
      this.currentPage = 1;
      this.findPage();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.findPage();
    },
  },

  watch: {
    searchBarLoading: {
      immediate: true,
      handler(val, oldval) {
        if (!val) {
          // console.log("init columns");
          // init
          this.paginationAttr = this.pagination.props;
          this.columns.forEach((item) => {
            if (!item.hideInForm) {
              // 这里的赋值需要用到$set，因为组件初始化的时候form没有二级对象，没有进行双向绑定
              this.$set(
                this.form,
                item.dataIndex,
                item.initialValue || undefined
              );
            }
          });
        }
      },
    },
  },

  render(h) {
    // console.log("pro-table渲染视图");

    return (
      <div
        class="pro_table"
        style={
          this.height
            ? {
                display: "flex",
                "flex-direction": "column",
                height: this.height,
              }
            : undefined
        }
      >
        {/* 搜索部分 */}
        <search-bar
          loading={this.searchBarLoading}
          ref="search-bar"
          // model={this.form}//model是jsx-vue2的rootAttrs，不可直接使用，通过下方的props的方式写入model
          props={{ model: this.form }}
          handleSearch={this.handleSearch}
          handleClear={this.handleClear}
          scopedSlots={{
            default: (scoped) => (
              <label>
                {this.columns
                  .filter((item) => !item.hideInForm)
                  .map((item, idx) => (
                    <Json2FormItem
                      props={{ model: this.form, item }}
                    ></Json2FormItem>
                  ))}
              </label>
            ),
            R: () => this.$slots.searchBtns,
            B: () => this.$slots.searchBarBottom,
          }}
        ></search-bar>

        {/* 插槽 */}
        {this.$slots.tableTop}

        {/* 表格部分 */}
        <el-table
          ref="table"
          vLoading={this.tableLoading}
          data={this.pageResult.content}
          props={{
            ...this.table.props,
            height: this.height ? "100%" : undefined,
            ...this.table.methods,
          }}
          on={this.table.event}
        >
          {this.columns
            .filter((item) => !item.hideInTable)
            .map((item, idx) => (
              <Json2TableColumn item={item} />
            ))}
        </el-table>

        {/* 分页部分 */}
        <el-pagination
          ref="pagination"
          class="pro_table-pagination"
          props={{ ...this.paginationAttr, ...this.pagination.methods }}
          on={this.pagination.event}
          vOn:size-change={this.handleSizeChange}
          vOn:current-change={this.handleCurrentChange}
          current-page={this.currentPage}
          total={this.pageResult.totalSize}
        ></el-pagination>
      </div>
    );
  },
};
</script>

<style lang="scss" scoped>
.pro_table {
  ::v-deep .pro_table-pagination {
    padding: 15px 0;
    text-align: center;
  }
}
</style>

<!--
 * @Author: zoufengfan
 * @Date: 2022-06-01 15:11:47
 * @LastEditTime: 2023-02-16 15:10:04
 * @LastEditors: zoufengfan
-->

<script>
import Json2FormItem from '../json2form-item';
import Json2TableColumn from '../json2table-column';
import proForm from '../pro-form';

export default {
  name: 'ProTable',
  components: {
    proForm,
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
    initialValues: Object,
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
    tableProps: {
      type: Object,
      required: false,
    },
    // ========= el-pagination组件相关,与文档一样 ==========
    paginationProps: {
      type: Object,
      required: false,
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
    // table字段配置
    tableColumns() {
      return this.columns.filter((item) => !item.hideInTable);
    },
  },
  methods: {
    // 搜索参数
    getSearchParams() {
      let params = {
        params: this.$refs['pro-form'].model,
        pageNum: this.currentPage,
        pageSize: this.paginationAttr.pageSize,
      };
      // 过滤
      this.columns.forEach((item) => {
        if (item.hideInForm) {
          delete params.params[item.dataIndex];
        }
      });
      return this.transformParams ? this.transformParams(params) : params;
    },
    //   点击搜索框
    handleSearch() {
      if (!this.canSearch(this.$refs['pro-form'].model)) return;
      this.currentPage = 1;
      this.findPage();
    },
    //   点击重置表单
    handleClear() {
      this.$emit('reset');
      this.$refs['pro-form'].resetFields();
    },
    // 获取分页数据
    findPage() {
      return new Promise((res, rej) => {
        // nextTick为了防止没有获取最新的searchParams
        this.$nextTick(() => {
          this.$emit('search');
          const params = this.getSearchParams();
          this.tableLoading = true;
          this.listPms(params)
            .then((_res) => {
              res(_res);
              if (_res.code === 200) {
                this.pageResult = _res.data;
              } else {
                rej(_res);
                this.$message({
                  type: 'error',
                  message: _res.msg,
                });
              }
            })
            .catch((e) => {
              rej(e);
              this.$message({
                type: 'error',
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
          console.log('table columns', this.columns);
          // init
          this.paginationAttr = {
            pageSize: 10,
            pageSizes: [10, 50, 100, 200],
            layout: 'total, sizes, prev, pager, next, jumper',
            on: {},
            ...this.paginationProps,
          };
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
                display: 'flex',
                'flex-direction': 'column',
                height: this.height,
              }
            : undefined
        }
      >
        {/* 搜索部分 */}
        <div class="search-bar" v-loading={this.searchBarLoading}>
          {this.searchBarLoading || (
            <pro-form
              ref="pro-form"
              class="table_form"
              loading={this.searchBarLoading}
              columns={this.columns}
              initialValues={this.initialValues}
              inline={false}
              label-position="left"
            >
              <template slot="after">
                <div class="search-btns">
                  {this.$slots.searchBtns || (
                    <div>
                      <el-button
                        type="primary"
                        size="small"
                        vOn:click={() => this.handleSearch()}
                      >
                        查 询
                      </el-button>
                      <el-button
                        size="small"
                        vOn:click={() => this.handleClear()}
                      >
                        重置
                      </el-button>
                    </div>
                  )}
                </div>
                <div class="search-bar-bottom">
                  {this.$slots.searchBarBottom}
                </div>
              </template>
            </pro-form>
          )}
        </div>

        {/* 插槽 */}
        {this.$slots.tableTop}

        {/* 表格部分 */}
        <el-table
          ref="table"
          vLoading={this.tableLoading}
          data={this.pageResult.content}
          props={{
            border: true,
            size: 'medium',
            on: {},
            height: this.height ? '100%' : undefined,
            ...this.tableProps,
          }}
          on={this.tableProps && this.tableProps.on}
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
          props={{ ...this.paginationProps, ...this.paginationAttr }}
          on={this.paginationProps && this.paginationProps.on}
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

<style scoped>
::v-deep .pro_table-pagination {
  padding: 15px 0;
  text-align: center;
}
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
.table_form ::v-deep .el-form-item {
  display: inline-block;
  vertical-align: top;
  margin-right: 10px;
}
.table_form ::v-deep .el-form-item__label {
  float: none;
}
.table_form ::v-deep .el-form-item__content {
  display: inline-block;
}
</style>

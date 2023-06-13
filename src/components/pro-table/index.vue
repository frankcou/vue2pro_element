<!--
 * @Author: zoufengfan
 * @Date: 2022-06-01 15:11:47
 * @LastEditTime: 2023-03-10 09:36:57
 * @LastEditors: zoufengfan
-->

<script>
import Json2TableColumn from '../json2table-column';
import proForm from '../pro-form';
function debounce(fn, delay = 1000) {
  let time = null;
  function _debounce() {
    if (time !== null) clearTimeout(time);
    time = setTimeout(fn, delay);
  }
  return _debounce;
}

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
      或者直接返回 { 
        content: [{}], 
        totalSize: 222, 
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
    /**可利用此属性对搜索栏高度进行调整，单位px */
    searchBarHeight: {
      type: Number,
      default: 44 * 3 - 1, //包括搜索按钮位置，默认3行高度 + 1px border
      required: false,
    },
    /**form表单是否脱离文档流 */
    formRenderType: {
      type: String,
      default: 'normal', // 'normal'|'abs'
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
      isOpen: false,
      /**实例化之后的form的高度，取scrollHeight */
      formHeight: 0,
    };
  },
  computed: {
    // table字段配置
    tableColumns() {
      return this.columns.filter((item) => !item.hideInTable);
    },
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
      this.$emit('toggle', this.isOpen);
    },
    // 搜索参数
    async getSearchParams() {
      await this.$nextTick();
      let params = {
        params: this.$refs['pro-form'].model,
        pageNum: this.currentPage,
        pageSize: this.paginationAttr.pageSize,
      };
      // console.log('getSearchParams', this.$refs['pro-form'].model);
      // 过滤
      this.columns.forEach((item) => {
        if (item.hideInForm) {
          delete params.params[item.dataIndex];
        }
      });
      return this.transformParams ? this.transformParams(params) : params;
    },
    //   点击搜索框
    async handleSearch() {
      await this.$nextTick();
      if (!this.canSearch(this.$refs['pro-form'].model)) return;
      this.currentPage = 1;
      if (this.formRenderType === 'abs') this.isOpen = false;
      this.findPage();
    },
    //  重置表单
    handleClear() {
      this.$emit('clear');
      this.$refs['pro-form'].clearFields();
    },
    // 清空表单
    handleReset() {
      this.$emit('reset');
      this.$refs['pro-form'].resetFields();
    },
    // 获取分页数据
    findPage() {
      return new Promise(async (res, rej) => {
        // nextTick为了防止没有获取最新的searchParams
        this.$emit('search');
        const params = await this.getSearchParams();
        this.tableLoading = true;
        this.listPms(params)
          .then((_res) => {
            if (_res.code !== undefined) {
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
            } else {
              this.pageResult = _res;
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
          // console.log('table columns', this.columns);
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
    columns: {
      handler(val, oldval) {
        this.isOpen = false;
        this.$nextTick(() => {
          if (this.$refs['pro-form'].$el) {
            this.formHeight = this.$refs['pro-form'].$el.scrollHeight;
          }
        });
      },
    },
  },

  mounted() {
    window.onresize = () => {
      this.isOpen = false;
      debounce(() => {
        // console.log(this.$refs['pro-form'].$el.scrollHeight);
        if (this.$refs['pro-form'].$el) {
          this.formHeight = this.$refs['pro-form'].$el.scrollHeight;
        }
      }, 300)();
    };
  },
  beforeDestroy() {
    window.onresize = null;
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
        <div
          class="search-bar"
          v-loading={this.searchBarLoading}
          style={
            this.formRenderType === 'abs'
              ? `height:${this.searchBarHeight}px`
              : ''
          }
        >
          {this.searchBarLoading || (
            <pro-form
              ref="pro-form"
              class={`table_form`}
              loading={this.searchBarLoading}
              columns={this.columns}
              initialValues={this.initialValues}
              inline={false}
              label-position="left"
              style={
                (this.formRenderType === 'abs'
                  ? `position: absolute;
                      top: 0;
                      left: 0;
                      right: 0;`
                  : '') +
                `height:${
                  this.isOpen
                    ? `${this.formHeight}px`
                    : `${this.searchBarHeight}px`
                }`
              }
            >
              <template slot="after">
                <div
                  class="search-bar-bottom clearfix"
                  style={`${
                    this.formRenderType === 'normal' ? '' : 'padding: 0 0;'
                  }`}
                >
                  <div class="fl">{this.$slots.searchBarBottom}</div>
                  <div class="search-btns fr">
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
                        {/* {this.formHeight}，{this.searchBarHeight} */}
                        {this.formHeight > this.searchBarHeight && (
                          <el-button
                            class="toggle_btn"
                            type="text"
                            vOn:click={() => this.toggle()}
                          >
                            {this.isOpen ? '收起' : '展开'}
                            <i
                              class={`el-icon-arrow-${
                                this.isOpen ? 'up' : 'down'
                              } el-icon--right`}
                            />
                          </el-button>
                        )}
                      </div>
                    )}
                  </div>
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
            on: {},
            height: this.height ? '500px' : undefined,
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
  position: relative;
  /* table的fixed：left/right有4级层高 */
  z-index: 5;
  padding: 10px 15px;
}
.table_form {
  /* position: absolute;
  top: 0;
  left: 0;
  right: 0; */
  padding-bottom: 44px;
  background: #fff;
  border-radius: 0 0 5px 5px;
  box-shadow: 0 10px 10px rgba(239, 239, 239, 0.5);
  border-bottom: 1px solid #efefef;
  box-sizing: border-box;
  overflow: hidden;
  transition: height 0.3s ease-in-out 0s;
}
.search-bar-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 10px 0;
  height: 44px;
}
::v-deep .el-form-item {
  margin-bottom: 10px;
}
.search-btns {
  display: inline-block;
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
.clearfix:after {
  content: '';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.clearfix {
  /* 触发 hasLayout */
  zoom: 1;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.toggle_btn {
  margin: 0 15px;
}
</style>

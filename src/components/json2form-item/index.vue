<!--
 * @Author: zoufengfan
 * @Date: 2022-06-01 17:38:41
 * @LastEditTime: 2022-07-04 15:18:14
 * @LastEditors: zoufengfan
-->

<script>
export default {
  name: "json2form-item",
  props: {
    // json配置
    item: {
      type: Object,
      required: true,
    },
    // 上一级数据存储对象
    value: {
      type: Object,
    },
    // el-form-item上的prop，二维数据校验的话必须填，如:[{label:'222'},{label:'33'}]这种数据
    // 输入示例：prop 或者 prop.2.prop
    prop: String,
    // 用于设置el-form-item__content的宽度
    // contentWidth: String,d
  },
  inject: ["elForm"],
  computed: {
    preLvData: {
      get() {
        return this.value || {};
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    rowIndex() {
      let propArr = (this.prop || "").split(".");
      propArr.length -= 1;
      return propArr[propArr.length - 1];
    },
    hideInForm() {
      return this.getObj(this.item.hideInForm);
    },
    fieldProps() {
      return this.getObj(this.item.fieldProps);
    },
    formItemProps() {
      return this.getObj(this.item.formItemProps);
    },
    scopedSlots() {
      return this.getObj(this.item.scopedSlots, this.rowIndex);
    },
    editable() {
      return this.item.editable === undefined ? true : this.item.editable;
    },
    options() {
      return this.getObj(this.item.options) || [];
    },
    dataIndex() {
      return this.item.dataIndex;
    },
    valueType() {
      return this.item.valueType;
    },
    required() {
      return (
        this.editable &&
        this.formItemProps &&
        (this.formItemProps.required || false)
      );
    },
    rules() {
      return (
        (this.formItemProps && this.formItemProps.rules) || this.item.rules
      );
    },
    emptyVal() {
      return this.item.title ? "-" : "";
    },
    renderDefVal() {
      return this.preLvData[this.dataIndex] === null ||
        this.preLvData[this.dataIndex] === undefined
        ? this.emptyVal
        : this.preLvData[this.dataIndex];
    },
  },
  methods: {
    validate(cb) {
      this.elForm.validateField(this.prop || this.dataIndex, cb);
    },
    getObj(obj, ...args) {
      if (obj && obj.constructor === Function)
        return obj(this.preLvData, ...args);
      else return obj;
    },
    getFieldEvents() {
      let map = {
        input: (e) => {
          // 正常赋值
          this.preLvData[this.dataIndex] = e;
          // 额外赋值
          if (typeof this.item.transform === "function") {
            let object = this.item.transform(e);
            for (const key in object) {
              if (Object.hasOwnProperty.call(object, key)) {
                const value = object[key];
                this.$set(this.preLvData, key, value);
              }
            }
          }
        },
      };
      if (this.fieldProps && this.fieldProps.on) {
        for (const key in this.fieldProps.on) {
          map[key] = (...e) => this.fieldProps.on[key](...e);
        }
      }
      return map;
    },
    getGroupColumns(row, index) {
      let cols = this.item.groupColumns;
      if (cols.constructor === Function) return cols({ row, index });
      return cols;
    },
  },
  // watch: {
  //   contentWidth: {
  //     immediate: true,
  //     handler(val) {
  //       document.body.style.setProperty("--formitem_content-w", val || "auto");
  //     },
  //   },
  // },
  // beforeDestroy() {
  //   document.body.style.removeProperty("--formitem_content-w");
  // },
  render() {
    // 解决jsx的ScopedSlots属性不完全奏效的问题
    const renderScopedSlots = () => {
      if (!this.scopedSlots) return "";
      return Object.keys(this.scopedSlots).map((slotName) => (
        <template slot={slotName}>{this.scopedSlots[slotName](this)}</template>
      ));
    };

    // 完全不渲染
    if (this.hideInForm) return "";

    // 完全自定义，为了方便定义多维数据
    if (this.editable && this.item.formItemRender) {
      return this.item.formItemRender(
        this.preLvData,
        this.elForm.model,
        this.prop
      );
    }

    // 正常情况
    return (
      <el-form-item
        class={{
          "json2form-item": true,
          group_item: this.valueType === "group",
          fit_w: !!this.contentWidth,
          is_editable: this.editable,
          "group_item-hidden":
            this.editable &&
            this.valueType === "group" &&
            (!this.preLvData[this.dataIndex] ||
              !this.preLvData[this.dataIndex].length),
        }}
        label={this.item.title}
        props={{
          prop: this.prop || this.dataIndex,
          ...this.formItemProps,
          rules: this.rules,
          required: this.required,
        }}
      >
        {this.editable
          ? // 编辑模式
            (() => {
              let p = {
                attrs: this.fieldProps,
                props: {
                  value: this.preLvData[this.dataIndex],
                  ...this.fieldProps,
                },
                on: this.getFieldEvents(),
              };
              // select 的 options
              let selectOptions = () => {
                // 分组的options
                if (this.options[0] && this.options[0].value === undefined) {
                  return (
                    <div>
                      {this.options.map((group) => (
                        <el-option-group key={group.label} props={group}>
                          <el-option
                            key={item.key || item.value}
                            props={item}
                          ></el-option>
                        </el-option-group>
                      ))}
                    </div>
                  );
                }
                // 非分组的options
                return (
                  <div>
                    {this.options.map((item) => (
                      <el-option
                        key={item.key || item.value}
                        props={item}
                      ></el-option>
                    ))}
                  </div>
                );
              };

              return (
                <div>
                  {(!this.valueType || this.valueType === "input") && (
                    <el-input {...p}>{renderScopedSlots()}</el-input>
                  )}
                  {this.valueType === "input-number" && (
                    <el-input-number {...p}>
                      {renderScopedSlots()}
                    </el-input-number>
                  )}
                  {this.valueType === "select" && (
                    <el-select {...p}>
                      {selectOptions()}
                      {renderScopedSlots()}
                    </el-select>
                  )}
                  {this.valueType === "cascader" && (
                    <el-cascader {...p}>{renderScopedSlots()}</el-cascader>
                  )}
                  {this.valueType === "switch" && (
                    <el-switch {...p}>{renderScopedSlots()}</el-switch>
                  )}
                  {this.valueType === "time-select" && (
                    <el-time-select {...p}>
                      {renderScopedSlots()}
                    </el-time-select>
                  )}
                  {this.valueType === "date-picker" && (
                    <el-date-picker {...p}>
                      {renderScopedSlots()}
                    </el-date-picker>
                  )}
                  {this.valueType === "date-time-picker" && (
                    <el-date-picker {...p}>
                      {renderScopedSlots()}
                    </el-date-picker>
                  )}
                  {this.valueType === "radio" && (
                    <el-radio {...p}>{renderScopedSlots()}</el-radio>
                  )}
                  {this.valueType === "checkbox" && (
                    <el-checkbox {...p}>{renderScopedSlots()}</el-checkbox>
                  )}
                  {this.valueType === "transfer" && (
                    <el-transfer {...p}>{renderScopedSlots()}</el-transfer>
                  )}
                  {/*  {this.valueType === 'file' && (
                      <el-select
                      >{renderScopedSlots()}</el-select>
                    )}{this.valueType === 'img' && (
                      <el-select
                      >{renderScopedSlots()}</el-select>
                    )} */}

                  {this.valueType === "group" &&
                    (this.preLvData[this.dataIndex] || []).map((row, idx) => {
                      return (
                        <el-row
                          align="top"
                          gutter={10}
                          style="margin-left: 0; margin-right: 0"
                        >
                          {this.getGroupColumns(row, idx).map((childItem) => {
                            return !this.getObj(childItem.hideInForm) ? (
                              <el-col
                                key={childItem.dataIndex}
                                props={childItem.colProps || { span: 12 }}
                              >
                                <json2form-item
                                  key={
                                    this.dataIndex +
                                    "." +
                                    idx +
                                    "." +
                                    childItem.dataIndex
                                  }
                                  prop={
                                    (this.prop || this.dataIndex) +
                                    "." +
                                    idx +
                                    "." +
                                    childItem.dataIndex
                                  }
                                  vModel={row}
                                  item={{
                                    ...childItem,
                                    editable:
                                      childItem.editable || this.editable,
                                  }}
                                ></json2form-item>
                              </el-col>
                            ) : (
                              ""
                            );
                          })}
                        </el-row>
                      );
                    })}
                </div>
              );
            })()
          : // 阅读模式
            (() => {
              if (this.item.dataRender) {
                return this.item.dataRender(this.preLvData);
              } else {
                if (this.valueType === "select") {
                  // 分组
                  if (this.options[0] && this.options[0].value === undefined) {
                    let label = this.emptyVal;
                    this.options.forEach((el) => {
                      el.options.forEach((_el) => {
                        if (_el.value === this.preLvData[this.dataIndex]) {
                          label = _el.label;
                        }
                      });
                    });
                    return label;
                  }
                  // 非分组
                  let opt = this.options.find(
                    (el) => el.value === this.preLvData[this.dataIndex]
                  );
                  return (
                    (opt && opt.label) ||
                    this.preLvData[this.dataIndex] ||
                    this.emptyVal
                  );
                } else if (this.valueType === "file") {
                  return (
                    <el-button
                      type="text"
                      disabled={!this.preLvData[this.dataIndex]}
                      on={{
                        click: () => {
                          const newTab = window.open();
                          newTab.opener = null;
                          newTab.location.href = this.preLvData[this.dataIndex];
                        },
                      }}
                    >
                      下载
                    </el-button>
                  );
                } else if (this.valueType === "img") {
                  return this.preLvData[this.dataIndex] ? (
                    <el-image
                      class="json-form-item-img"
                      src={this.preLvData[this.dataIndex]}
                      preview-src-list={[this.preLvData[this.dataIndex]]}
                    ></el-image>
                  ) : (
                    this.emptyVal
                  );
                } else if (this.valueType === "group") {
                  return (
                    <el-table data={this.preLvData[this.dataIndex] || []}>
                      {this.getGroupColumns().map((el) => {
                        if (el.title) {
                          return (
                            <el-table-column label={el.title} key={el.title}>
                              {this.renderDefVal}
                            </el-table-column>
                          );
                        }
                        return "";
                      })}
                      {/* */}
                    </el-table>
                  );
                }
                return this.renderDefVal;
              }
            })()}
      </el-form-item>
    );
  },
};
</script>

<style scoped>
.json-form-item-img {
  width: 70px;
  height: 70px;
}
.group_item {
  width: 100%;
}
.group_item.group_item-hidden {
  display: none;
}
.group_item > ::v-deep .el-form-item__content {
  width: 100%;
}
.group_item.is_editable > ::v-deep .el-form-item__content {
  padding-top: 15px;
  border: 1px dashed #dcdfe6;
}
/* .group_item.group_item-hidden > ::v-deep .el-form-item__content {
  padding-top: 15px;
  border: 1px dashed #dcdfe6;
} */
.json2form-item .el-select {
  width: 100%;
}
.json2form-item .el-date-editor.el-input {
  width: 100%;
}
.fit_w ::v-deep .el-form-item__content {
  width: var(--formitem_content-w);
}
</style>

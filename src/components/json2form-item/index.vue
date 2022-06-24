<!--
 * @Author: zoufengfan
 * @Date: 2022-06-01 17:38:41
 * @LastEditTime: 2022-06-24 13:53:02
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
  },
  computed: {
    form: {
      get() {
        return this.value || {};
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  render() {
    const getObj = (obj, ...args) => {
      if (!obj) return obj;
      if (obj.constructor === Object || obj.constructor === Array) return obj;
      if (obj.constructor === Function) return obj(this.form, ...args);
    };
    const { dataIndex, valueType } = this.item;
    const hideInForm = getObj(this.item.hideInForm);
    const fieldProps = getObj(this.item.fieldProps);
    const formItemProps = getObj(this.item.formItemProps);
    const scopedSlots = getObj(this.item.scopedSlots);
    const editable =
      this.item.editable === undefined ? true : this.item.editable;
    let options = getObj(this.item.options) || [];

    const getFieldEvents = () => {
      let map = {
        input: (e) => {
          // 正常赋值
          this.form[dataIndex] = e;
          // 额外赋值
          if (this.item.transform) {
            let object = this.item.transform(e);
            for (const key in object) {
              if (Object.hasOwnProperty.call(object, key)) {
                const value = object[key];
                this.$set(this.form, key, value);
              }
            }
          }
        },
      };
      if (fieldProps && fieldProps.on) {
        for (const key in fieldProps.on) {
          map[key] = (...e) => fieldProps.on[key](...e);
        }
      }
      return map;
    };

    const getGroupColumns = (row, index) => {
      let cols = this.item.groupColumns;
      if (cols.constructor === Function) return cols({ row, index });
      return cols;
    };

    // 好像jsx的scped
    const renderScopedSlots = () => {
      if (!scopedSlots) return "";
      return Object.keys(scopedSlots).map((slotName) => (
        <template slot={slotName}>{scopedSlots[slotName](this)}</template>
      ));
    };

    // 完全不渲染
    if (hideInForm) return "";

    // 完全自定义，为了方便定义多维数据
    if (editable && this.item.formItemRender)
      return this.item.formItemRender(this.form);

    // 正常情况
    return (
      <el-form-item
        ref="form-item"
        class={valueType === "group" ? "group_item" : ""}
        label={this.item.title ? this.item.title + (editable ? "" : ": ") : ""}
        props={{
          prop: dataIndex,
          ...formItemProps,
          required:
            editable && formItemProps && (formItemProps.required || false),
        }}
      >
        {editable
          ? // 编辑模式
            (() => {
              let p = {
                attrs: fieldProps,
                props: {
                  value: this.form[dataIndex],
                  ...fieldProps,
                },
                on: getFieldEvents(),
                // scopedSlots: getObj(this.item.scopedSlots),
              };
              // select 的 options
              let selectOptions = () => {
                // 分组的options
                if (options[0] && options[0].value === undefined) {
                  return (
                    <div>
                      {options.map((group) => (
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
                    {options.map((item) => (
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
                  {(!valueType || valueType === "input") && (
                    <el-input {...p}>{renderScopedSlots()}</el-input>
                  )}
                  {valueType === "input-number" && (
                    <el-input-number {...p}>
                      {renderScopedSlots()}
                    </el-input-number>
                  )}
                  {valueType === "select" && (
                    <el-select {...p}>
                      {selectOptions()}
                      {renderScopedSlots()}
                    </el-select>
                  )}
                  {valueType === "cascader" && (
                    <el-cascader {...p}>{renderScopedSlots()}</el-cascader>
                  )}
                  {valueType === "switch" && (
                    <el-switch {...p}>{renderScopedSlots()}</el-switch>
                  )}
                  {valueType === "time-select" && (
                    <el-time-select {...p}>
                      {renderScopedSlots()}
                    </el-time-select>
                  )}
                  {valueType === "date-picker" && (
                    <el-date-picker {...p}>
                      {renderScopedSlots()}
                    </el-date-picker>
                  )}
                  {valueType === "date-time-picker" && (
                    <el-date-picker {...p}>
                      {renderScopedSlots()}
                    </el-date-picker>
                  )}
                  {valueType === "radio" && (
                    <el-radio {...p}>{renderScopedSlots()}</el-radio>
                  )}
                  {valueType === "checkbox" && (
                    <el-checkbox {...p}>{renderScopedSlots()}</el-checkbox>
                  )}
                  {valueType === "transfer" && (
                    <el-transfer {...p}>{renderScopedSlots()}</el-transfer>
                  )}
                  {/*  {valueType === 'file' && (
                      <el-select
                      >{renderScopedSlots()}</el-select>
                    )}{valueType === 'img' && (
                      <el-select
                      >{renderScopedSlots()}</el-select>
                    )} */}

                  {valueType === "group" &&
                    (this.form[dataIndex] || []).map((row, idx) => {
                      return (
                        <el-row
                          align="top"
                          gutter={10}
                          style="margin-left: 0; margin-right: 0"
                        >
                          {getGroupColumns(row, idx).map((childItem) => {
                            return !getObj(childItem.hideInForm) ? (
                              <el-col
                                key={childItem.dataIndex}
                                props={childItem.colProps || { span: 12 }}
                              >
                                <json2form-item
                                  key={
                                    dataIndex +
                                    "-" +
                                    idx +
                                    "-" +
                                    childItem.dataIndex
                                  }
                                  vModel={row}
                                  item={{
                                    ...childItem,
                                    editable: childItem.editable || editable,
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
                return this.item.dataRender(this.form);
              } else {
                if (valueType === "select") {
                  // 分组
                  if (options[0] && options[0].value === undefined) {
                    let label = "-";
                    options.forEach((el) => {
                      el.options.forEach((_el) => {
                        if (_el.value === this.form[dataIndex]) {
                          label = _el.label;
                        }
                      });
                    });
                    return label;
                  }
                  // 非分组
                  let opt = options.find(
                    (el) => el.value === this.form[dataIndex]
                  );
                  return (opt && opt.label) || "-";
                } else if (valueType === "file") {
                  return (
                    <el-button
                      type="text"
                      disabled={!this.form[dataIndex]}
                      on={{
                        click: () => {
                          const newTab = window.open();
                          newTab.opener = null;
                          newTab.location.href = this.form[dataIndex];
                        },
                      }}
                    >
                      下载
                    </el-button>
                  );
                } else if (valueType === "img") {
                  return this.form[dataIndex] ? (
                    <el-image
                      class="json-form-item-img"
                      src={this.form[dataIndex]}
                      preview-src-list={[this.form[dataIndex]]}
                    ></el-image>
                  ) : (
                    "-"
                  );
                }
                return this.form[dataIndex] === null ||
                  this.form[dataIndex] === undefined
                  ? "-"
                  : this.form[dataIndex];
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
.group_item > ::v-deep .el-form-item__content {
  width: 100%;
}
</style>

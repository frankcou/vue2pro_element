<!--
 * @Author: zoufengfan
 * @Date: 2022-06-01 17:38:41
 * @LastEditTime: 2022-06-20 14:30:09
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
    // form数据存储对象
    model: {
      required: true,
      type: Object,
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
  render() {
    const getObj = (obj) => {
      if (!obj) return obj;
      if (obj.constructor === Object || obj.constructor === Array) return obj;
      if (obj.constructor === Function) return obj(this.form);
    };
    const { dataIndex, valueType } = this.item;
    const fieldProps = getObj(this.item.fieldProps);
    const formItemProps = getObj(this.item.formItemProps);
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
          map[key] = (...e) => fieldProps.on[key](this.form, ...e);
        }
      }
      return map;
    };

    // 完全自定义，为了方便定义多维数据
    if (editable && this.item.formItemRender)
      return this.item.formItemRender(this.form);

    return (
      <el-form-item
        label={this.item.title + (editable ? "" : ": ")}
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
                scopedSlots: getObj(this.item.scopedSlots),
              };
              // select 的 options
              let selectOptions = () => {
                // 分组的options
                if (options[0] && options[0].value === undefined) {
                  return (
                    <div>
                      {options.map((group) => (
                        <el-option-group key={group.label} props={group}>
                          <el-option key={item.value} props={item}></el-option>
                        </el-option-group>
                      ))}
                    </div>
                  );
                }
                // 非分组的options
                return (
                  <div>
                    {options.map((item) => (
                      <el-option key={item.value} props={item}></el-option>
                    ))}
                  </div>
                );
              };

              return (
                <div>
                  {(!valueType || valueType === "input") && (
                    <el-input {...p}></el-input>
                  )}
                  {valueType === "input-number" && (
                    <el-input-number {...p}></el-input-number>
                  )}
                  {valueType === "select" && (
                    <el-select {...p}>{selectOptions()}</el-select>
                  )}
                  {valueType === "cascader" && (
                    <el-cascader {...p}></el-cascader>
                  )}
                  {valueType === "switch" && <el-switch {...p}></el-switch>}
                  {valueType === "time-select" && (
                    <el-time-select {...p}></el-time-select>
                  )}
                  {valueType === "date-picker" && (
                    <el-date-picker {...p}></el-date-picker>
                  )}
                  {valueType === "date-time-picker" && (
                    <el-date-picker {...p}></el-date-picker>
                  )}
                  {valueType === "radio" && <el-radio {...p}></el-radio>}
                  {valueType === "checkbox" && (
                    <el-checkbox {...p}></el-checkbox>
                  )}
                  {valueType === "transfer" && (
                    <el-transfer {...p}></el-transfer>
                  )}
                  {/*  {valueType === 'file' && (
                      <el-select
                      ></el-select>
                    )}{valueType === 'img' && (
                      <el-select
                      ></el-select>
                    )} */}
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

<style>
.json-form-item-img {
  width: 70px;
  height: 70px;
}
</style>

<!--
 * @Author: zoufengfan
 * @Date: 2022-06-01 17:38:41
 * @LastEditTime: 2022-06-13 10:13:05
 * @LastEditors: zoufengfan
-->

<script>
export default {
  name: "json2form-item",
  props: {
    item: {
      type: Object,
      required: true,
    },
    // form数据存储对象
    model: {
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
  render() {
    const getObj = (obj) => {
      if (!obj) return obj;
      if (obj.constructor === Object) return obj;
      if (obj.constructor === Function) return obj(this.form);
    };

    const fieldProps = getObj(this.item.fieldProps);

    const getFieldEvents = () => {
      let map = {
        input: (e) => {
          // 正常赋值
          this.form[this.item.dataIndex] = e;
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

    return (
      <el-form-item
        label={this.item.title}
        props={{
          prop: this.item.dataIndex,
          ...getObj(this.item.formItemProps),
        }}
      >
        {(() => {
          if (this.item.fieldRender) {
            return this.item.fieldRender(this.form);
          } else {
            let p = {
              attrs: fieldProps,
              props: { value: this.form[this.item.dataIndex], ...fieldProps },
              on: getFieldEvents(),
              scopedSlots: getObj(this.item.scopedSlots),
            };

            let options = getObj(this.item.options);

            // select 的 options
            let selectScopedSlots = () => {
              // 分组的options
              if (options[0].options) {
                return {
                  default: (
                    <div>
                      {options.map((group) => (
                        <el-option-group key={group.label} label={group.label}>
                          <el-option
                            key={item.value}
                            label={item.label}
                            value={item.value}
                          ></el-option>
                        </el-option-group>
                      ))}
                    </div>
                  ),
                };
              }
              // 非分组的options
              return {
                default: (
                  <div>
                    {options.map((item) => (
                      <el-option
                        key={item.value}
                        label={item.label}
                        value={item.value}
                      ></el-option>
                    ))}
                  </div>
                ),
              };
            };

            return (
              <div>
                {(!this.item.valueType || this.item.valueType === "input") && (
                  <el-input {...p}></el-input>
                )}
                {this.item.valueType === "input-number" && (
                  <el-input-number {...p}></el-input-number>
                )}
                {this.item.valueType === "select" && (
                  <el-select scopedSlots={selectScopedSlots} {...p}></el-select>
                )}
                {this.item.valueType === "cascader" && (
                  <el-cascader {...p}></el-cascader>
                )}
                {this.item.valueType === "switch" && (
                  <el-switch {...p}></el-switch>
                )}
                {this.item.valueType === "time-select" && (
                  <el-time-select {...p}></el-time-select>
                )}
                {this.item.valueType === "date-picker" && (
                  <el-date-picker {...p}></el-date-picker>
                )}
                {this.item.valueType === "date-time-picker" && (
                  <el-date-picker {...p}></el-date-picker>
                )}
                {this.item.valueType === "radio" && (
                  <el-radio {...p}></el-radio>
                )}
                {this.item.valueType === "checkbox" && (
                  <el-checkbox {...p}></el-checkbox>
                )}
                {this.item.valueType === "transfer" && (
                  <el-transfer {...p}></el-transfer>
                )}
                {/*  {this.item.valueType === 'file' && (
                      <el-select
                      ></el-select>
                    )}{this.item.valueType === 'img' && (
                      <el-select
                      ></el-select>
                    )} */}
              </div>
            );
          }
        })()}
      </el-form-item>
    );
  },
};
</script>

<style></style>
